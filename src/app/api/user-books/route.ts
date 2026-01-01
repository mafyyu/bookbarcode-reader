import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { IsbnSchema } from "@/lib/schema/book";
import { BookSchema } from "@/lib/schema/book";
import { supabase } from "@/lib/supabase";
import z from "zod";

type Book = z.infer<typeof BookSchema>;

type UserBook = Book & {
  isOwned: boolean;
};

// ユーザが登録した本を全て取得するAPI
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from("user_books")
      .select(
        `
        is_owned,
        books (
          isbn,
          title,
          titleKana,
          author,
          publisherName,
          image,
          caption,
          salesDate
        )
      `,
      )
      .eq("user_id", userId);

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to fetch user books" },
        { status: 500 },
      );
    }

    const result = data
      .filter((row) => row.books !== null)
      .map((row) => ({
        isOwned: row.is_owned,
        book: row.books,
      }));

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 },
    );
  }
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
