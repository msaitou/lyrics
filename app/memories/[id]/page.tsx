// @/app/memories/[id]/page.tsx
import { getPostData, getSortedPostsData } from "@/lib/memories";
import { DetailLayout } from "@/components/edit/detail-layout";
const DB_TYPE = process.env.NEXT_PUBLIC_DB_TYPE;

export default async function Post({ params }: { params: { id: string } }) {
  console.log("para", params);
  const decodedId = decodeURIComponent(params.id);
  const [postData, allData] = await Promise.all([getPostData(decodedId as string), getSortedPostsData()]);

  return (
    <DetailLayout postData={postData} allData={allData}>
      test
    </DetailLayout>
  );
}
// 動的metadata生成
export async function generateMetadata({ params }: { params: { id: string } }) {
  const decodedId = decodeURIComponent(params.id);
  const postData = await getPostData(decodedId as string);
  return {
    title: postData.title,
    description: postData.remarks,
  };
}
