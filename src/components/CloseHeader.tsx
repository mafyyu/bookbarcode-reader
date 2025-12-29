import Link from "next/link";

const styles = {
  LinkContainer: {
    display: "flex",
    position: "absolute",
    top: "20px",
    right: "20px",
  },
  closeIcon: {
    width: "40px",
    height: "40px",
  },
} as const;

export default function CloseHeader() {
  return (
    <>
      <Link href="/" style={styles.LinkContainer}>
        <img style={styles.closeIcon} src="/close.svg" alt="" />
      </Link>
    </>
  );
}
