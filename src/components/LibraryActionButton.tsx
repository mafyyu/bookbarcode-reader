import "./LibraryActionButton.css";

type LibraryStatus = "not_in_library" | "in_library" | "owned";

type Props = {
  status: LibraryStatus;
  onAdd?: () => void; // ライブラリに追加する処理
  onChangeOwned?: () => void; // 所持済みに変更する処理
};

export default function LibraryActionButton({
  status,
  onAdd,
  onChangeOwned,
}: Props) {
  switch (status) {
    case "not_in_library":
      return (
        <>
          <button onClick={onAdd} className="buttonBase add">
            ライブラリに追加
          </button>
        </>
      );

    case "in_library":
      return (
        <>
          <button onClick={onChangeOwned} className="buttonBase changeOwned">
            購入済みにする
          </button>
        </>
      );

    case "owned":
      return (
        <>
          <button disabled className="buttonBase owned">
            ライブラリ追加済み
          </button>
        </>
      );
  }
}
