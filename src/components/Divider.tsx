const styles = {
  container: {
    width: "100%",
    margin: "0 0 24px 0",
  },
  text: {
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "8px",
  },
  line: {
    width: "100%",
    height: "1px",
    backgroundColor: "#E5E7EB",
  },
} as const;

export default function Divider({ text }: { text: string }) {
  return (
    <div style={styles.container}>
      <div style={styles.text}>{text}</div>
      <div style={styles.line} />
    </div>
  );
}
