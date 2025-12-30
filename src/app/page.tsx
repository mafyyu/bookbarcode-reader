"use client";
import ScanButton from "@/components/ScanButton";
import BookCard from "@/components/BookCard";

export default function Home() {
  const book1 = {
    imageUrl:
      "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/3674/9784088843674_1_9.jpg?_ex=200x200",
    isOwned: true,
  };
  const book2 = {
    imageUrl:
      "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/3674/9784088843674_1_9.jpg?_ex=200x200",
    isOwned: false,
  };

  return (
    <div>
      <BookCard book={book1} />
      <BookCard book={book2} />
      <div>
        <ScanButton />
      </div>
    </div>
  );
}
