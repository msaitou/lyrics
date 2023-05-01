import fs from "fs";
import path from "path";
import { DB_INFO } from "../config";
export type memoriesCol = { _id?: any; author: string; title: string; lylic: string; remarks: string; update: string };
const kariDatas: [memoriesCol] = [
  {
    _id: "",
    author: "hide",
    title: "frame",
    lylic: JSON.stringify(`Dear my sun. Should I know how low & low?
  Dear my moon. Should I know how low & low?
  Dear my stars　星の嘆き聞けば
  Like a wind　ほんの小さな事だろう
  悲しみは腕広げて
  君の肩を抱くだろう
  優しげな振る舞いで　君にからまる
  It's a flame of sadness
  Dear my mind　どんな不幸にでも
  Say hello　言える気持ちほしい
  Dear my hurts　いつも抱えていた
  Like a wind　重い物捨てよう
  夜の風　浴びていれば
  忘れられる事なら
  その歩幅広げてみる
  前よりもずっと
  笑う月の蒼い光
  傷をそっと　閉じていくよ
  It's a flame of sadness　降りそそぐ悲しみすら　抱きよせ
  Life is going on　枯れるまで　歩いて行くだけ
  It's a flame of sadness
  Dear my sun. Should I know how low & low?
  Dear my moon. Should I know how low & low?
  Dear my stars.　星の嘆き聞けば
  Like a wind.　ほんの小さな事だろう
  降る星を数え終えたら　泣くのやめて歩いて行こう
  Flame of misery　愛しさを憎しみを受け止めて
  It's a flame of sadness　腕の中で砕いてしまえ　全て
  Pieces of sadness　降りそそぐ雨がやんだら行こう
  Life is going on　枯れるまで歩いて行くだけ
  Stay free my misery
  ‥‥my misery`),
    remarks: "",
    update: "2023-04-27T07:11:02.346Z",
  },
];
export function getSortedPostsData() {
  const allPostsData = kariDatas;
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.update < b.update) {
      return 1;
    } else {
      return -1;
    }
  });
}
const url = DB_INFO.URL;
const reqApi = (params: any, query = "") => {
  return fetch(`${url}${query}`, params)
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
      console.log("err");
    });
};
async function getMemories() {
  let findData = {
    host: DB_INFO.HOST,
    dbName: DB_INFO.DB_NAME,
    coll: "memories",
    method: "find",
    cond: {},
  };
  let recs: {rec:[memoriesCol]} = await reqApi({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(findData),
  });
  console.log(recs);
  return recs.rec;
}
export async function getAllPostIds() {
  let recs: [memoriesCol]  = await getMemories();
  // var saveDatas = { ...kariDatas[0] };
  // delete saveDatas._id;
  // let postData = {
  //   host: DB_INFO.HOST,
  //   dbName: DB_INFO.DB_NAME,
  //   coll: "memories",
  //   method: "insertMany",
  //   opt: { doc: [saveDatas] },
  // };
  // let data = await reqApi({
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(postData),
  // });
  // console.log("data:", recs);
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
  const matterResult = { data: { date: "", title: "" } };
  let recs: [memoriesCol]  = await getMemories();
  // Use remark to convert markdown into HTML string
  // const processedContent = await remark().use(html).process(matterResult.content);
  const processedContent = recs[0].lylic;
  var contentHtml = JSON.parse(processedContent) as string;
  contentHtml = contentHtml.replaceAll("\n","<br>");
  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...(recs[0]),
  };
}
