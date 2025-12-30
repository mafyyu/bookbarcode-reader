const styles = {
  container: {
    display: "flex",
    width: "80%",
    flexDirection: "column",
  },
  text: {
    paddingLeft: "10px",
    fontSize: "20px",
  },
  divider: {
    width: "100%",
    height: "2px",
    backgroundColor: "#E5E7EB",
  },
} as const;

export default function Divider({ text }: { text: string }) {
  return (
    <>
      <div style={styles.container}>
        <h3 style={styles.text}>{text}</h3>
        <div style={styles.divider}></div>
      </div>
    </>
  );
}
