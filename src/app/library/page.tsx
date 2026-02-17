"use client";
import ScanButton from "@/components/ScanButton";
import BookCard from "@/components/BookCard";
import { useEffect, useState } from "react";
import BookDetail from "@/components/BookDetail";
import { AnimatePresence } from "motion/react";
import styles from "./page.module.css";
import SegmentedControl from "@/components/SegmentedControl";
import { FilterStatus } from "@/components/SegmentedControl";

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

export default function Library() {
  const [books, setBooks] = useState<UserBook[]>([]);
  const [activeCard, setActiveCard] = useState<UserBook | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");

  // statusを変えるための関数
  const setFilterValue = (value: FilterStatus) => {
    setFilter(value);
  };

  const visibleBook = books.filter((b) => {
    switch (filter) {
      case "all":
        return true;
      case "owned":
        return b.isOwned === "owned";
      case "not":
        return b.isOwned === "in_library";
    }
  });

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
      <div className={styles.main}>
        <SegmentedControl
          status={filter}
          options={[
            { label: "すべて", value: "all" },
            { label: "購入済み", value: "owned" },
            { label: "未購入", value: "not" },
          ]}
          onChange={setFilterValue}
        />
        <main className={styles.bookDisplay}>
          <AnimatePresence mode="wait">
            {activeCard && (
              <BookDetail
                userBook={activeCard}
                onClose={() => setActiveCard(null)}
              ></BookDetail>
            )}
          </AnimatePresence>
          <div className={styles.container}>
            {visibleBook.map((userBook) => (
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
      </div>
    </>
  );
}
