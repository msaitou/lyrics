const { DB_URL, DB_HOST, DB_NAME } = process.env;
const url = DB_URL;
export type memoriesCol = { _id?: any; author: string; title: string; lyric: string; remarks: string; update: string };
export async function getSortedPostsData() {
  const allPostsData = (await getMemories({})) as [memoriesCol];
  return allPostsData.sort((a, b) => {
    // 作者で並び替え
    if (a.author !== b.author) {
      if (a.author < b.author) return -1;
      if (a.author > b.author) return 1;
    }
    // 曲名で並び替え
    if (a.title !== b.title) {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
    }
    return 0;
  });
}
const reqApi = async (params: any, query = "") => {
  return await fetch(`${url}${query}`, params)
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
      console.log("err");
    });
};
async function getMemories(cond: any) {
  let findData = {
    host: DB_HOST,
    dbName: DB_NAME,
    coll: "memories",
    method: "find",
    cond,
  };
  let recs: { rec: [memoriesCol] } = await reqApi({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(findData),
  });
  // console.log(recs);
  return recs.rec;
}
export async function getAllPostIds() {
  let recs: [memoriesCol] = await getMemories({});
  return recs.map((rec) => {
    return {
      params: {
        id: `${rec.author}-${rec.title}`,
      },
    };
  });
}
export async function getPostData(id: string) {
  // Use gray-matter to parse the post metadata section
  if (id) {
    let para = id.split("-");
    console.log("aaaaaaaaaaaaa", para);
    let recs: [memoriesCol] = await getMemories({ title: para[1], author: para[0] });
    const processedContent = recs[0].lyric;
    recs[0].lyric = JSON.parse(processedContent) as string;
    var contentHtml = recs[0].lyric.replaceAll("\n", "<br>");
    return {
      id,
      contentHtml,
      // contentHtml:recs[0].lyric,
      ...recs[0],
    };
  } else return null;
}
