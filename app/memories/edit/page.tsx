// @/app/memories/edit/page.tsx
import Edit from "@/app/memories/edit/[id]/page";
import { getPostData } from "@/lib/memories";

export default async function Add({ params }: { params: { id: string } }) {
  console.log("ADDparams", params);
  console.log(params);
  const decodedId = params.id ? decodeURIComponent(params.id) : undefined;
  console.log("decodedId", decodedId);
  const [postData] = await Promise.all([getPostData(decodedId as string)]);

  // async function getPost(id: string) {
  //   console.log("p@p@", id);
  //   let data = await getPostData(id as string);
  //   delete data.contentHtml;
  //   console.log("editData", data);
  //   return data;
  // }
  // let data = decodedId ? getPost(decodedId) : null;

  return <Edit params={params} data={postData}></Edit>;
}
// 動的metadata生成(page.tsxに書かないと動作しないぽい)
export async function generateMetadata({ params }: { params: { id: string } }) {
  return { title: "New Add", description: "now create that New lyricPage" };
}
