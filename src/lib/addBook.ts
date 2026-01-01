import z from "zod";
import { BookSchema } from "./schema/book";

type Book = z.infer<typeof BookSchema>;

export async function addBook(book: Book) {
  const res = await fetch("/api/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error ?? "Failed to add book");
  }

  return res.json();
}
