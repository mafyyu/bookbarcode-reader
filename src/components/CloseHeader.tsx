import Image from "next/image";
import Link from "next/link";

const styles = {
  LinkContainer: {
    display: "flex",
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "none",
    border: "none",
  },
  closeIcon: {
    width: "40px",
    height: "40px",
  },
} as const;

type CloseHeaderProps = {
  onClose: () => void;
};
export default function CloseHeader({ onClose }: CloseHeaderProps) {
  return (
    <>
      <button onClick={onClose} style={styles.LinkContainer}>
        <Image
          style={styles.closeIcon}
          src="/close.svg"
          alt="close"
          width={40}
          height={40}
        />
      </button>
    </>
  );
}
