import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { IsbnSchema } from "@/lib/schema/book";
import { supabase } from "@/lib/supabase";

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
