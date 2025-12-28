import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const isbnNumber = request.nextUrl.searchParams.get("isbn");

  if (isbnNumber === null || isbnNumber.trim() === "") {
    return NextResponse.json(
      { error: 'Missing required "isbn" query parameter' },
      { status: 400 },
    );
  }
  // isbnのバーコードかどうかをチェック
  const IsbnSchema = z
    .string()
    .length(13)
    .regex(/^(978|979)\d{10}$/, "Invalid ISBN");

  const ResponseSchema = z.object({
    title: z.string(),
    author: z.string(),
    largeImageUrl: z.url().optional(),
    isbn: IsbnSchema,
  });

  const BookResponseSchema = z
    .object({
      Items: z.array(
        z.object({
          Item: ResponseSchema,
        }),
      ),
    })
    .transform((data) =>
      data.Items.map(({ Item }) => ({
        title: Item.title,
        author: Item.author,
        isbn: Item.isbn,
        image: Item.largeImageUrl ?? null,
      })),
    );

  const parsed = IsbnSchema.safeParse(isbnNumber);

  // バーコードが適していない場合にはエラーを返す
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid ISBN" }, { status: 400 });
  }

  const res = await fetch(
    `${process.env.RAKUTEN_API_BASE_URL}&isbn=${isbnNumber}`,
  );
  const data = await res.json();
  const parsedResponse = BookResponseSchema.safeParse(data);

  console.log(data.Items);
  return NextResponse.json(parsedResponse);
}
