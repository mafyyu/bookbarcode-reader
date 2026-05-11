# FetchState

`FetchState` は、スキャン結果の取得まわりを表す UI 状態です。
「読み込み中」「取得成功」「見つからない」「エラー」などを同時に持たず、
常にどれか1つの状態として扱うために使います。

```ts
type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; books: Book[]; libraryStatus: LibraryStatus }
  | { status: "notFound" }
  | { status: "error"; reason: "bookFetch" | "statusFetch" | "network" };
```

## 状態

### `idle`

初期状態です。まだ本情報の取得は始まっていません。
バーコードを読み取る前、または手入力検索を始める前の状態に使います。

### `loading`

ISBN から本情報を取得している状態です。
この状態の間はローディング UI を表示します。

### `success`

本情報とライブラリ登録状態の両方を取得できた状態です。

使えるデータ:

- `books`: 取得した本情報。
- `libraryStatus`: 未登録、ライブラリ登録済み、購入済みのどれか。

`BookPreview`、`OwnedStatusBadge`、`LibraryActionButton` のように
本情報が必要なコンポーネントは、この状態のときだけ表示します。

### `notFound`

リクエスト自体は成功したものの、対象の ISBN に対応する本が見つからなかった状態です。
「本が見つかりませんでした」のようなユーザー向けメッセージを表示します。

### `error`

通常の結果を表示する前に処理が失敗した状態です。
API から返ってきたエラーメッセージをそのまま UI に出さず、
`reason` を固定のユーザー向けメッセージに変換して表示します。

理由:

- `bookFetch`: `/api/books` の取得に失敗した。
- `statusFetch`: `/api/user-books/status` の取得に失敗した。
- `network`: ネットワークエラーなどで `fetch` 自体が失敗した

