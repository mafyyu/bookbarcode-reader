import Image from "next/image";

const styles = {
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px auto",
    borderRadius: "50%",
    width: "100px",
    height: "100px",
    backgroundColor: "#FFFFFF",
    filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.25))",
  },
  scanIcon: {
    width: "60%",
    height: "60%",
    display: "block",
  },
};

export default function ScanButton() {
  return (
    <>
      <a href="/scan" style={styles.button}>
        <Image
          style={styles.scanIcon}
          src="/barcode_scan.svg"
          alt="scanButton"
          width={60}
          height={60}
        />
      </a>
    </>
  );
}
