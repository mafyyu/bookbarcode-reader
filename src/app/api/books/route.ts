import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// isbnのバーコードかどうかをチェック
const IsbnSchema = z
  .string()
  .length(13)
  .regex(/^(978|979)\d{10}$/, "Invalid ISBN");

const bodySchema = z.object({
  isbn: IsbnSchema,
});

const ResponseSchema = z.object({
  title: z.string(),
  titleKana: z.string(),
  author: z.string(),
  publisherName: z.string(),
  largeImageUrl: z.url().optional(),
  isbn: IsbnSchema,
  salesDate: z.string(),
});

export const BookResponseSchema = z
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
      titleKana: Item.titleKana,
      author: Item.author,
      publisherName: Item.publisherName,
      isbn: Item.isbn,
      image: Item.largeImageUrl ?? null,
      salesDate: Item.salesDate,
    })),
  );

export async function POST(request: NextRequest) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsedBody = bodySchema.safeParse(body);

  // バーコードが適していない場合にはエラーを返す
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid ISBN" }, { status: 400 });
  }

  const { isbn } = parsedBody.data;

  const res = await fetch(`${process.env.RAKUTEN_API_BASE_URL}&isbn=${isbn}`);
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch data from Rakuten API" },
      { status: res.status },
    );
  }
  const data = await res.json();
  const parsedResponse = BookResponseSchema.safeParse(data);

  if (!parsedResponse.success) {
    console.error("Failed to parse Rakuten API response", parsedResponse.error);
    return NextResponse.json(
      { error: "Failed to parse response from book API" },
      { status: 502 },
    );
  }

  return NextResponse.json(parsedResponse.data);
}
