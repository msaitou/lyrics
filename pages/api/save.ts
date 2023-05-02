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
  console.log("req", req.body);
  let post = req.body;
  let cond = {};
  if (post._id) cond = { _id: post._id };
  let saveData = {
    ...comApiData,
    coll: "memories",
    method: "update",
    opt: { doc: { ...post, lyric: JSON.stringify(post.lyric), update: new Date() } },
    cond,
  };
  let data2 = await reqApi({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(saveData),
  });
  res.status(200).json({ name: data2 });
}
