function myFunction() {
  const token = ScriptApp.getOAuthToken();
  const props = PropertiesService.getScriptProperties();
  const inFolderId = props.getProperty("SCREENSHOTS_FOLDER_ID");
  const outFolderId = props.getProperty("PROJECT_FORDER_ID");
  run_({
    token,
    inFolderId,
    outFolderId,
    fileName: "memo-images",
    description: `# メモとして採取した画像

## このファイルについて

スマートフォンを利用しているときにメモとして採取した画像を 1 つのファイルにまとめたものです。

メモとして以下のような画像を採取しています。

- スクリーンショット
- 「ドライブ」アプリによるスキャン画像
- 「かこって検索」などで共有した画像

## 画像の内容について

画像内のテキストが記述されている場合、そのテキストについてユーザーから質問されることがあります。画像内にテキストが記載されている場合は、その内容を事前に把握するようにしてください。

画像が風景の場合、その風景の場所や関連施設についてユーザーから質問されることがあります。画像内の情報(看板や標識など)から位置や施設を事前に把握するようにしてください。

## 画像のリンクについて

返答に画像にファイル名を含める場合は、画像のリンクもテキストとして表示してください。。


## 画像の一覧

このセクションに画像の一覧が表示されます。

`,
  });
}

function run_({ token, inFolderId, outFolderId, fileName, description }) {
  let body = `${description}


`;
  for (const file of getImageFiles_(inFolderId)) {
    const imageUrl = idToSignedUrl_(token, file.id);
    const previewUrl = `https://drive.google.com/file/d/${file.id}/view?usp=drive_link`;
    //console.log(file.id,url)

    body = `${body}

### ${file.name}

- ${previewUrl}
- ![](${imageUrl})

`;
  }

  //console.log(body)
  saveFile_(outFolderId, fileName, body);
}

function* getImageFiles_(folderId) {
  const after = new Date(Date.now() - 3600000 * 24 * 7).toISOString();
  const opts = {
    // 特定の日時以降に更新されたファイルを取得しているが、アップロードエラーを繰り返すと作成時刻が数時間ズレることもある。
    q: `mimeType contains 'image/' and modifiedTime > '${after}' and '${folderId}' in parents and trashed=false`,
    orderBy: "modifiedTime desc",
    //pageSize: 100,
  };
  let pageToken = "";
  do {
    const f = Drive.Files.list({
      ...opts,
      pageToken,
    });
    pageToken = f.nextPageToken;
    for (const file of f.files) {
      yield file;
    }
  } while (pageToken);
}

function idToSignedUrl_(token, id) {
  const headers = { authorization: `Bearer ${token}` };
  //const url = `https://lh3.google.com/u/0/d/${id}=w800-iv1`
  const url = `https://lh3.google.com/u/0/d/${id}`;
  const res = UrlFetchApp.fetch(url, {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    followRedirects: false,
    muteHttpExceptions: true,
  });
  const resCode = res.getResponseCode();
  if (resCode >= 300 && resCode < 400) {
    const location = res.getHeaders()["Location"];
    if (location) {
      return location;
    }
  }
  throw new Error(
    `idToSignedUrl: code:${resCode} text:${res.getContentText()}`
  );
}

function getExitFileId_(folderId, fileName) {
  const f = Drive.Files.list({
    q: `name = '${fileName}' and '${folderId}' in parents and trashed=false`,
  });
  if (f.files.length > 0) {
    return f.files[0].id;
  }
  return "";
}

function saveFile_(folderId, fileName, body) {
  const mediaData = Utilities.newBlob("")
    .setDataFromString(body, "UTF-8")
    .setContentType("text/markdown");
  const existFileId = getExitFileId_(folderId, fileName);
  let id = "";
  if (existFileId) {
    console.log("- update");
    const resource = {
      name: fileName,
      //parents: [folderId],
      //mimeType: 'application/vnd.google-apps.document'
    };
    const res = Drive.Files.update(resource, existFileId, mediaData);
    console.log(res);
    id = res.id;
  } else {
    const resource = {
      name: fileName,
      parents: [folderId],
      mimeType: "application/vnd.google-apps.document",
    };
    const res = Drive.Files.create(resource, mediaData);
    console.log(res);
    id = res.id;
  }
}
