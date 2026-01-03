const styles = {
  card: {
    position: "relative",
    width: "100%",
    maxWidth: "120px",
  },
  cover: {
    width: "100%",
    filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.50))",
  },
  ownedBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "25px",
    height: "25px",
    backgroundColor: "#58AB64CC",
    position: "absolute",
    borderRadius: "100%",
    top: "10px",
    right: "6px",
  },
  wantedBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "25px",
    height: "25px",
    backgroundColor: "#FFB877CC",
    position: "absolute",
    borderRadius: "100%",
    top: "10px",
    right: "6px",
  },
  badgeIcon: {
    width: "80%",
    height: "80%",
    display: "block",
  },
} as const;

type BookCardProps = {
  book: {
    isbn: string;
    imageUrl: string;
    isOwned: "owned" | "in_library";
  };
  onClick: () => void;
};

import { motion } from "motion/react";

export default function BookCard({ book, onClick }: BookCardProps) {
  switch (book.isOwned) {
    case "owned":
      return (
        <>
          <div style={styles.card} onClick={onClick}>
            <motion.img
              layoutId={`bookcover-${book.isbn}`}
              style={styles.cover}
              src={book.imageUrl}
              alt="bookCover"
            />
            <div style={styles.ownedBadge}>
              <img style={styles.badgeIcon} src={"/owned.svg"} alt="badge" />
            </div>
          </div>
        </>
      );
    case "in_library":
      return (
        <>
          <div style={styles.card} onClick={onClick}>
            <motion.img
              layoutId={`bookcover-${book.isbn}`}
              style={styles.cover}
              src={book.imageUrl}
              alt="bookCover"
            />
            <div style={styles.wantedBadge}>
              <img style={styles.badgeIcon} src={"/wanted.svg"} alt="badge" />
            </div>
          </div>
        </>
      );
  }
}
