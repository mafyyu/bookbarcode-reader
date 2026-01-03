import { UserBook } from "@/app/page";
import OwnedStatusBadge from "./OwnedStatusBadge";
import { motion } from "motion/react";
import Image from "next/image";
import Divider from "./Divider";
import CloseHeader from "./CloseHeader";

const MotionImage = motion.create(Image);

const styles = {
  header: {
    height: "70px",
    position: "relative",
    zIndex: "100",
  },
  container: {
    position: "fixed",
    inset: "0",
    zIndex: "50",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
    overflowY: "auto",
    flex: "1",
  },
  imgContainer: {
    width: "100%",
    maxWidth: "120px",
    marginTop: "10%",
  },
  cover: {
    width: "100%",
    filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.50))",
    aspectRatio: "2 / 3",
    objectFit: "cover",
  },
  contents: {
    display: "flex",
    flexDirection: "column",
    marginTop: "20px",
    gap: "10px",
    maxWidth: "65%",
    alignItems: "center",
    justifyContent: "center",
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
  dividerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
} as const;

type BookCardProps = {
  userBook: UserBook;
  onClose: () => void;
};

export default function BookDetail({ userBook, onClose }: BookCardProps) {
  const { book, isOwned } = userBook;

  return (
    <>
      <header style={styles.header}>
        <CloseHeader onClose={() => onClose()} />
      </header>
      <div style={styles.container}>
        <div style={styles.imgContainer}>
          {book.image && (
            <MotionImage
              layoutId={`bookcover-${book.isbn}`}
              style={styles.cover}
              src={book.image}
              alt=""
              width={120}
              height={180}
              sizes="120px"
            />
          )}
        </div>
        <div style={styles.contents}>
          <h3 style={styles.title}>{book.title}</h3>
          <h4 style={styles.author}>{book.author}</h4>
          <h4 style={styles.author}>ISBN-{book.isbn}</h4>
          <OwnedStatusBadge status={isOwned}></OwnedStatusBadge>
          <Divider text={"あらすじ"}></Divider>
          <div style={styles.dividerContainer}></div>
          <h4 style={styles.author}>{book.caption}</h4>
        </div>
      </div>
    </>
  );
}
