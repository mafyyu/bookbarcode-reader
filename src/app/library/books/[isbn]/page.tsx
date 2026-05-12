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

  try {
    const res = await fetch(`http://localhost:3000/api/user-books/${isbn}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    userData = await res.json();
  } catch (e) {
    console.log(e);
  }

  return (
    <div>
      <CloseHeader href="/library" />
      {userData && <BookDetail userBook={userData}></BookDetail>}
    </div>
  );
}
