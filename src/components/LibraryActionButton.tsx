import "./LibraryActionButton.css";

type LibraryStatus = "not_in_library" | "in_library" | "owned";

type Props = {
  status: LibraryStatus;
  onAddOwned?: () => void; // ライブラリに追加する処理
  onAddNotOwned?: () => void;
  onChangeOwned?: () => void; // 所持済みに変更する処理
  disabled: boolean;
};

export default function LibraryActionButton({
  status,
  onAddOwned,
  onAddNotOwned,
  onChangeOwned,
  disabled,
}: Props) {
  console.log("aaa", status);
  switch (status) {
    case "not_in_library":
      return (
        <>
          <button
            onClick={onAddOwned}
            disabled={disabled}
            className="buttonBase addAlreadybuy"
          >
            購入済みとして追加
          </button>
          <button
            onClick={onAddNotOwned}
            disabled={disabled}
            className="buttonBase addNotbuy"
          >
            未購入として追加
          </button>
        </>
      );

    case "in_library":
      return (
        <>
          <button
            onClick={onChangeOwned}
            disabled={disabled}
            className="buttonBase changeOwned"
          >
            購入済みにする
          </button>
        </>
      );

    case "owned":
      return (
        <>
          <button disabled className="buttonBase owned">
            購入済み
          </button>
        </>
      );
  }
}
