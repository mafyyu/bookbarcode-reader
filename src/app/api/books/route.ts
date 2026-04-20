import { NextRequest, NextResponse } from "next/server";
import { bodySchema, BookResponseSchema } from "@/lib/schema/book";

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

  const baseUrl = process.env.RAKUTEN_API_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json(
      { error: "RAKUTEN_API_BASE_URL is not configured" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(`${baseUrl}&isbn=${isbn}`);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data from Rakuten API" },
        { status: 502 },
      );
    }
    const data = await res.json();
    const parsedResponse = BookResponseSchema.safeParse(data);

    if (!parsedResponse.success) {
      console.error(
        "Failed to parse Rakuten API response",
        parsedResponse.error,
      );
      return NextResponse.json(
        { error: "Invalid book API response" },
        { status: 502 },
      );
    }
    return NextResponse.json(parsedResponse.data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Unexpected error while fetching Rakuten API" },
      { status: 502 },
    );
  }
}
