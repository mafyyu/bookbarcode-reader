"use client";
import ScanButton from "@/components/ScanButton";
import BookCard from "@/components/BookCard";
import { useEffect, useState } from "react";
import BookDetail from "@/components/BookDetail";
import { AnimatePresence } from "motion/react";
import styles from "./page.module.css";

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
  const [activeCard, setActiveCard] = useState<UserBook | null>(null);

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
    <>
      <main>
        <AnimatePresence mode="wait">
          {activeCard && (
            <BookDetail
              userBook={activeCard}
              onClose={() => setActiveCard(null)}
            ></BookDetail>
          )}
        </AnimatePresence>
        <div className={styles.container}>
          {books.map((userBook) => (
            <BookCard
              key={userBook.book.isbn}
              book={{
                isbn: userBook.book.isbn,
                imageUrl: userBook.book.image,
                isOwned: userBook.isOwned,
              }}
              onClick={() => setActiveCard(userBook)}
            />
          ))}
        </div>
      </main>
      <footer className={styles.footer}>
        <ScanButton />
      </footer>
    </>
  );
}
