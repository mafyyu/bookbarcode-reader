import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { IsbnSchema } from "@/lib/schema/book";
import { supabase } from "@/lib/supabase";
import z from "zod";

type LibraryStatus = "not_in_library" | "in_library" | "owned";

// user_booksに存在するか確認するAPI
export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isbn = request.nextUrl.searchParams.get("isbn");
  if (!isbn) {
    return NextResponse.json({ error: "ISBN required" }, { status: 400 });
  }

  const parsedIsbn = IsbnSchema.safeParse(isbn);
  if (!parsedIsbn.success) {
    return NextResponse.json({ error: "Invalid ISBN data" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("user_books")
    .select("is_owned")
    .eq("isbn", parsedIsbn.data)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
  let status: LibraryStatus;

  if (!data) {
    status = "not_in_library";
  } else if (data.is_owned) {
    status = "owned";
  } else {
    status = "in_library";
  }

  return NextResponse.json({ status: status });
}

const bodySchema = z.object({
  isbn: IsbnSchema,
  isOwned: z.boolean(),
});

// user_booksに登録するAPI
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsedBody = bodySchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid ISBN data" }, { status: 400 });
  }

  const { error } = await supabase.from("user_books").insert({
    isbn: parsedBody.data.isbn,
    user_id: userId,
    is_owned: parsedBody.data.isOwned,
  });
  if (error) {
    return NextResponse.json(
      { error: "Failed to register book" },
      { status: 500 },
    );
  }

  return NextResponse.json({ result: "created" }, { status: 201 });
}

// 購入済みを変更するAPI
export async function PATCH(request: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsedBody = bodySchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid ISBN data" }, { status: 400 });
  }

  const { error } = await supabase
    .from("user_books")
    .update({
      is_owned: parsedBody.data.isOwned,
    })
    .select("is_owned")
    .eq("user_id", userId)
    .eq("isbn", parsedBody.data.isbn)
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to update book status" },
      { status: 500 },
    );
  }

  return NextResponse.json({ result: "success update" }, { status: 200 });
}
