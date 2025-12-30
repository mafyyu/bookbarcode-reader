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
  notOwned: {
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
};

export default function OwnedStatusBadge({ isOwned }: { isOwned: boolean }) {
  return (
    <>
      <div style={isOwned ? styles.owned : styles.notOwned}>
        {isOwned ? "所有済み" : "未購入"}
      </div>
    </>
  );
}
