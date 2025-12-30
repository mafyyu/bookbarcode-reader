import { BookResponseSchema } from "@/app/api/books/route";
import z from "zod";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
  },
  imgContainer: {
    width: "100%",
    maxWidth: "120px",
    margin: "auto",
  },
  cover: {
    width: "100%",
    filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.50))",
    marginTop: "20%",
  },
  contents: {
    display: "flex",
    flexDirection: "column",
    marginTop: "20px",
    gap: "10px",
  },
  title: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
  },
  author: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "normal",
  },
} as const;

type Book = z.infer<typeof BookResponseSchema>;

export default function BookDetail({ book }: { book: Book }) {
  return (
    <>
      <div style={styles.container}>
        <div style={styles.imgContainer}>
          <img style={styles.cover} src={book[0]?.image || ""} alt="" />
        </div>
        <div style={styles.contents}>
          <h3 style={styles.title}>{book[0]?.title}</h3>
          <h4 style={styles.author}>{book[0]?.author}</h4>
          <h4 style={styles.author}>ISBN-{book[0]?.isbn}</h4>
        </div>
      </div>
    </>
  );
}
