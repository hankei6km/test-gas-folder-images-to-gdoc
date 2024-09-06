# test-gas-folder-images-to-gdoc

Google ドライブのフォルダー内の画像を 1 つの Google ドキュメントファイルへまとめるスクリプト(GAS)

Zenn に記事を作る予定。

## 概要

以下の手順で簡易的な [Pixel Screenshot](https://store.google.com/intl/en/ideas/articles/pixel-screenshots/) 的なものを作るための実験的なスクリプトです。

- スマートフォンのスクリーンショットを Google ドライブのフォルダーへ共有(アップロード)
- フォルダー内の画像ファイルを定期的に Google ドキュメントファイルにまとめる
- まとめた Google ドキュメントファイルを元にノートブックを作る

## 準備

1. Google ドライブ上で以下のようにフォルダーを作成
   1. どこかにフォルダーを 1 つ作成(名前は任意)
   2. 上記フォルダーの下にスクリーンショット保存用のフォルダーを 1 つ作成(名前は任意)
2. 最初に作成したフォルダーの中に新規で Google Apps Script プロジェクトを作成
3. プロジェクトのサービスに Drive API(v3) を追加
4. 上記スクリプトをプロイジェクトへ貼り付け
5. 以下のスクリプトプロパティを追加
   1. `PROJECT_FORDER_ID` - 最初に作成したフォルダーの ID
   2. `SCREENSHOTS_FOLDER_ID` - スクリーンショット保存用フォルダーの ID

## 使う

準備ができたら、試しに手動で起動します。

権限の確認などを求められるで内容を確認し許可します。処理が成功すると最初に作成したフォルダーの中に `memo-images` という名前で Gogole ドキュメント形式のファイルが作成されます。

ファイル作成を確認できたら時間主導のトリガーを作成し定期的に実行させます。あとは、スクリーンショット保存用のフォルダーに画像ファイルを保存しておくと、定期的に `memo-images` ファイル内に画像の一覧が作成されます。

## 画像アップロード

Android からスクリーンショットを Google ドライブへ保存する方法いくつかありますが、とりあえず試す場合は共有メニューが簡単かと思います。

スクリーンショット採取後に共有メニューから「ドライブ」を選択するとフォルダーへ保存されます(次回以降は共有メニューにフォルダーが表示されます)。

> [!CAUTION]
> Markdown 文字列は単純な文字列連結で処理しています。とくに、画像のファイル名はエスケープされずに利用されるので、スクリーンショット保存用フォルダーは信頼でき作成元からのファイルのみ保存してください。

## License

MIT License

Copyright (c) 2024 hankei6km
