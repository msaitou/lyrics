"use client";
// @/components/edit/detail-layout.tsx
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import utilStyles from "@/styles/utils.module.css";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { FormData, onRemove } from "@/components/edit/actions";

function Form({
  onSubmit,
  postData,
}: {
  onSubmit: (data: FormData) => void;
  postData: {
    _id: string;
    title: string;
    contentHtml: string;
    remarks: string;
    author: string;
  };
}) {
  // フォームの管理
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  console.log("postDataF", postData);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input id="_id" type="hidden" value={postData._id} {...register("_id")}></input>
      <div className="flex mt-4 w-full mx-auto">
        <div className="flex mt-4 w-full mx-auto justify-between">
          <p className="leading-relaxed text-green-500">{postData ? <Link href={`edit/${postData.author}-${postData.title}`}>Edit →</Link> : ""}</p>
          <p className="leading-relaxed text-pink-300">
            <Link href={`chord-list`} target="_blank">
              chord-list →
            </Link>
          </p>
          <button className="leading-relaxed text-red-500 hover:underline border-0" type="submit">
            delete
          </button>
        </div>
      </div>
    </form>
  );
}

export function DetailLayout({ children, postData, allData }: { children:any, postData: any; allData: any }) {
  const router = useRouter();
  // 入力値を受け取って保存する関数
  const onSubmit = async (data: FormData) => {
    if (window.confirm("are you really delete this lyric?")) {
      let res = await onRemove(data);
      console.log("res", res);
    }
  };
  let baseFlag = false;
  let allPostsData: any[] = [];
  allData.some((d:FormData, i: number) => {
    if (postData?.author_title == `${d.author}-${d.title}`) baseFlag = true;
    if (baseFlag && allPostsData.length < 4) {
      allPostsData.push(d);
      for (let j = i - allPostsData.length; allData.length - 1 == i && j > -1 && allPostsData.length < 4; j = j - 1) {
        console.log(j, 9);
        allPostsData.unshift(allData[j]);
      }
      if (i === allData.length - 1 && allPostsData.length >= 3) {
        console.log("kita2");
        for (let j = i - allPostsData.length - 1; j > -1 && allPostsData.length < 7; j = j - 1) {
          console.log(j, 3, `${allData[j].author}-${allData[j].title}`);
          if (postData?.author_title == `${allData[j].author}-${allData[j].title}`) break;
          allPostsData.unshift(allData[j]);
        }
        return true;
      }
    } else if (baseFlag && allPostsData.length >= 3) {
      console.log("kita");
      for (let j = i - allPostsData.length - 1; j > -1 && allPostsData.length < 7; j = j - 1) {
        console.log(j, 3, `${allData[j].author}-${allData[j].title}`);
        if (postData?.author_title == `${allData[j].author}-${allData[j].title}`) break;
        allPostsData.unshift(allData[j]);
      }
      return true;
    }
  });

  if (!postData) return null;
  else
    return (
      <Layout>
        <article>
          <h1 className={utilStyles.headingXl}>{postData.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </article>
        <div className="p-4 bg-gray-900">{postData.remarks}</div>
        <Form onSubmit={onSubmit} postData={postData}></Form>
        <div className="flex flex-wrap -m-2 py-8">
          {allPostsData.map(rec => (
            <div className="p-2 w-1/2 lg:w-1/4 md:w-1/3 sm:w-1/2" key={`${rec.author}-${rec.title}`}>
              {`${rec.author}-${rec.title}` == `${postData.author}-${postData.title}` ? (
                <div className="h-full flex items-center border-gray-500 border p-4 rounded-lg">
                  <div className="flex-grow">
                    <h2 className="text-gray-400 title-font font-medium">{rec.title}</h2>
                    <p className="text-gray-600">{rec.author}</p>
                  </div>
                </div>
              ) : (
                <Link href={`${rec.author}-${rec.title}`}>
                  <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
                    <div className="flex-grow">
                      <h2 className="text-gray-100 title-font font-medium">{rec.title}</h2>
                      <p className="text-gray-400">{rec.author}</p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
      </Layout>
    );
}
