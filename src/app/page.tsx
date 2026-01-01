"use client";
import ScanButton from "@/components/ScanButton";
import BookCard from "@/components/BookCard";
import { useEffect, useState } from "react";
import BookDetail from "@/components/BookDetail";

export type UserBook = {
  isOwned: "in_library" | "owned";
  book: {
    isbn: string;
    title: string;
    titleKana: string;
    author: string;
    publisherName: string;
    image: string;
    caption: string;
    salesDate: string;
  };
};

export default function Home() {
  const [books, setBooks] = useState<UserBook[]>([]);

  useEffect(() => {
    const fetchUserBook = async () => {
      try {
        const res = await fetch("/api/user-books");
        const data = await res.json();
        setBooks(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserBook();
  }, []);

  return (
    <div>
      {books.map(({ book, isOwned }) => (
        <BookCard
          key={book.isbn}
          book={{ imageUrl: book.image, isOwned: isOwned }}
        />
      ))}
      <div>
        <ScanButton />
      </div>
    </div>
  );
}
