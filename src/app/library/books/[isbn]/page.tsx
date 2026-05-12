import BookDetail from "@/components/BookDetail";
import CloseHeader from "@/components/CloseHeader";
import type { UserBook } from "@/lib/schema/book";
import { cookies } from "next/headers";

export default async function BookDetails({
  params,
}: {
  params: Promise<{ isbn: string }>;
}) {
  const cookieStore = await cookies();
  const { isbn } = await params;
  let userData: UserBook | null = null;
  let errorMessage: string | null = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/user-books/${isbn}`,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      },
    );
    if (!res.ok) {
      errorMessage = `API Error: ${res.status}`;
    } else {
      userData = await res.json();
    }
  } catch (e) {
    errorMessage = "本の詳細情報の取得に失敗しました";
    console.log(e);
  }

  return (
    <div>
      <CloseHeader href="/library" />
      <p>{errorMessage}</p>
      {userData && <BookDetail userBook={userData}></BookDetail>}
    </div>
  );
}
