import { UserBook } from "@/app/page";
import OwnedStatusBadge from "./OwnedStatusBadge";

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

export default function BookDetail({ userBook }: { userBook: UserBook }) {
  const { book, isOwned } = userBook;

  return (
    <>
      <div style={styles.container}>
        <div style={styles.imgContainer}>
          <img style={styles.cover} src={book.image} alt="" />
        </div>
        <div style={styles.contents}>
          <h3 style={styles.title}>{book.title}</h3>
          <h4 style={styles.author}>{book.author}</h4>
          <h4 style={styles.author}>ISBN-{book.isbn}</h4>
          <OwnedStatusBadge status={isOwned}></OwnedStatusBadge>
        </div>
      </div>
    </>
  );
}
