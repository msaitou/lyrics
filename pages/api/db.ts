// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
type Data = {
  name: string;
};
const { DB_URL, DB_HOST, DB_NAME } = process.env;
const comApiData = { host: DB_HOST, dbName: DB_NAME };
const reqApi = (params: any, query = "") => {
  return fetch(`${DB_URL}${query}`, params)
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
      console.log("err");
    });
};
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  console.log("req", req.body, req.query);
  let post = req.body;
  let kind = req.query.kind;
  let result: string = "";
  switch (kind) {
    case "save":
      result = await save(post);
      break;
    case "remove":
      result = await remove(post);
      break;
  }
  res.status(200).json({ name: result });
}
async function save(post: any) {
  let cond = {};
  if (post._id) cond = { _id: post._id };
  delete post._id;  // ObjectId型でないので、update時に変更されたとみなされるのでどのみち削除
  let saveData = {
    ...comApiData,
    coll: "memories",
    method: "update",
    opt: { doc: { ...post, lyric: JSON.stringify(post.lyric), update: new Date() } },
    cond,
  };
  let result = await reqApi({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(saveData),
  });
  return result;
}
async function remove(post: any) {
  let cond = {};
  let result: string = "";
  if (post._id) {
    cond = { _id: post._id };
    let saveData = {
      ...comApiData,
      coll: "memories",
      method: "delete",
      cond,
    };
    result = await reqApi({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(saveData),
    });
  }
  return result;
}
