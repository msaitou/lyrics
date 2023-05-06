import Layout from "../../components/layout";
import { getAllPostIds, getPostData, getSortedPostsData, memoriesCol } from "../../lib/memories";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";

type FormData = {
  _id: string;
  title: string;
  author: string;
  lyric: string;
  remarks: string;
  update: string;
};
export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  console.log("id:::", params?.id);
  const postData = await getPostData(params?.id as string);
  // console.log('sareteru',postData);
  const allData = await getSortedPostsData();
  let allPostsData: any = [];
  let baseFlag = false;
  allData.some((d, i) => {
    if (params?.id == `${d.author}-${d.title}`) baseFlag = true;
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
          if (params?.id == `${allData[j].author}-${allData[j].title}`) break;
          allPostsData.unshift(allData[j]);
        }
        return true;
      }
    } else if (baseFlag && allPostsData.length >= 3) {
      console.log("kita");
      for (let j = i - allPostsData.length - 1; j > -1 && allPostsData.length < 7; j = j - 1) {
        console.log(j, 3, `${allData[j].author}-${allData[j].title}`);
        if (params?.id == `${allData[j].author}-${allData[j].title}`) break;
        allPostsData.unshift(allData[j]);
      }
      return true;
    }
  });

  return {
    props: {
      postData,
      allPostsData,
    },
  };
};

function Form({
  onSubmit,
  postData,
}: {
  onSubmit: (data: FormData) => void;
  postData: { _id: string; title: string; contentHtml: string; remarks: string; author: string };
}) {
  // フォームの管理
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input id="_id" type="hidden" value={postData._id} {...register("_id")}></input>
      <div className="flex mt-4 w-full mx-auto">
        <div>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-green-500">
            {postData ? <Link href={`edit?id=${postData.author}-${postData.title}`}>Edit →</Link> : ""}
          </p>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-pink-300">
            <Link href={`chord-list`} target="_blank">
              chord-list →
            </Link>
          </p>
        </div>
        <button
          className="ml-auto text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"
          type="submit"
        >
          delete
        </button>
      </div>
    </form>
  );
}
export default function Post({
  postData,
  allPostsData,
}: {
  postData: { _id: string; title: string; contentHtml: string; remarks: string; author: string };
  allPostsData: memoriesCol[];
}) {
  console.log("postData", allPostsData);
  const router = useRouter(); // 先に書かないとだめポイ

  // 入力値を受け取って保存する関数
  const onSubmit = async (data: FormData) => {
    if (window.confirm("are you really delete this lyric?")) {
      try {
        const res = await fetch("/api/db?kind=remove", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          router.back();
          // alert("Saved successfully");
        } else {
          alert("Something went wrong");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  if (!postData) return;
  else
    return (
      <Layout>
        <Head>
          <title>{postData.title}</title>
        </Head>
        <article>
          <h1 className={utilStyles.headingXl}>{postData.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </article>
        <div className="p-4 bg-gray-900">{postData.remarks}</div>
        <Form onSubmit={onSubmit} postData={postData}></Form>
        <div className="flex flex-wrap -m-2 py-8">
          {allPostsData.map((rec) => (
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
