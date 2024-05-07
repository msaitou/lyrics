// "use server"
// @/app/memories/edit/[id]/page.tsx
import { EditLayout } from "@/components/edit/edit-layout";
import { getPostData } from "@/lib/memories";
const DB_TYPE = process.env.NEXT_PUBLIC_DB_TYPE;

export default function Edit({ params, data }: { params: { id: string }; data: any }) {
  const decodedId = params.id ? decodeURIComponent(params.id) : undefined;
  console.log("decodedId", decodedId);
  return <EditLayout id={decodedId} data={data}></EditLayout>;
}
// export default async function Edit({ params, data }: { params: { id: string } ,data: any}) {
//   const decodedId = params.id ? decodeURIComponent(params.id) : undefined;
//   console.log("decodedId", decodedId);
//   const [postData] = await Promise.all([getPostData(decodedId as string)]);
//   return <EditLayout id={decodedId} data={postData}></EditLayout>;
// }
// 動的metadata生成(page.tsxに書かないと動作しないぽい)
export async function generateMetadata({ params }: { params: { id: string } }) {
  const decodedId = decodeURIComponent(params.id);
  const postData = await getPostData(decodedId as string);
  return {
    title: postData.title ? `${postData.title} Edit` : "new Add",
    description: postData.remarks,
  };
}
