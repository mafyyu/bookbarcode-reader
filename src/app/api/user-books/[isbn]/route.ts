import { createSupabaseClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { IsbnSchema, UserBookSchema } from "@/lib/schema/book";

// isbnを受け取ってuser-booksに含まれる場合、その書籍データを返すAPI
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ isbn: string }> },
) {
  const { supabase, userId } = await createSupabaseClient();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { isbn } = await params;
  const parsedIsbn = IsbnSchema.safeParse(isbn);
  if (!parsedIsbn.success) {
    return NextResponse.json({ error: "Invalid ISBN data" }, { status: 400 });
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
      .eq("user_id", userId)
      .eq("isbn", parsedIsbn.data)
      .maybeSingle();

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to fetch user books" },
        { status: 500 },
      );
    }

    if (!data || !data.books) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const result = {
      isOwned: data.is_owned ? "owned" : "in_library",
      book: data.books,
    };

    const parsedResult = UserBookSchema.safeParse(result);
    if (!parsedResult.success) {
      return NextResponse.json(
        { error: "Invalid user book data" },
        { status: 500 },
      );
    }
    return NextResponse.json(parsedResult.data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 },
    );
  }
}
