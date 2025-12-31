const styles = {
  owned: {
    display: "flex",
    borderRadius: "40px",
    width: "100px",
    backgroundColor: "#58AB64CC",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: "4/1",
    margin: "8px auto",
    padding: "3px",
    fontSize: "13px",
  },
  inLibrary: {
    display: "flex",
    borderRadius: "40px",
    width: "100px",
    backgroundColor: "#FFB877CC",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: "4/1",
    margin: "auto",
    padding: "3px",
    fontSize: "13px",
  },
  notInLibrary: {
    display: "flex",
    borderRadius: "40px",
    width: "100px",
    backgroundColor: "#F2F2F2CC",
    color: "black",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: "4/1",
    margin: "auto",
    padding: "3px",
    fontSize: "13px",
  },
};
type LibraryStatus = "not_in_library" | "in_library" | "owned";

export default function OwnedStatusBadge({
  status,
}: {
  status: LibraryStatus;
}) {
  let text;
  let style: React.CSSProperties;
  switch (status) {
    case "owned":
      text = "購入済み";
      style = styles.owned;
      break;
    case "in_library":
      text = "未購入";
      style = styles.inLibrary;
      break;
    case "not_in_library":
      text = "未登録";
      style = styles.notInLibrary;
      break;
  }
  return (
    <>
      <div style={style}>{text}</div>
    </>
  );
}
