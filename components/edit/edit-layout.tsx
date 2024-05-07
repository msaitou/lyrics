"use client";
// @/components/edit/edit-layout.tsx
import Layout from "@/components/layout";
import Form from "@/components/edit/edit-form";
import utilStyles from "@/styles/utils.module.css";
import Link from "next/link";
export function EditLayout({ id, data }: { id?: string, data?:any}) {
  console.log("EditLayout", id);
  if (data || !id)
    return (
      <Layout edit>
        <article>
          <h1 className={utilStyles.headingXl}>{data?.title ? `editting (${data?.title})` : "adding"}</h1>
          <p className="mx-auto leading-relaxed">
            <Link className="text-green-400" href="/memories/edit">
              Add→
            </Link>
          </p>
          <span className="text-green-500"></span>
          <Form editData={data}></Form>
        </article>
      </Layout>
    );
  else return <>Loading・・・</>;
}
