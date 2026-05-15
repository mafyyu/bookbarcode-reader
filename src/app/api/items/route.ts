import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";
import { BookSchema } from "@/lib/schema/book";

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseClient();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BookSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid book data" }, { status: 400 });
  }

  const book = parsed.data;

  // supabaseに保存
  const { data, error } = await supabase
    .from("books")
    .upsert(
      {
        isbn: book.isbn,
        title: book.title,
        titleKana: book.titleKana,
        author: book.author,
        publisherName: book.publisherName,
        image: book.image,
        caption: book.caption,
        salesDate: book.salesDate,
      },
      { onConflict: "isbn" },
    )
    .select()
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to insert book" },
      { status: 500 },
    );
  }

  return NextResponse.json({ book: data }, { status: 201 });
}
