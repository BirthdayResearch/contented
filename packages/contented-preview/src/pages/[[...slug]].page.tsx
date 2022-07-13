import {allDocuments} from 'contentlayer/generated';
import truncate from 'lodash/truncate';
import { GetStaticPropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { jsonLdScriptProps } from 'react-schemaorg';
import { DigitalDocument } from 'schema-dts';

import ContentHeadings from './_components/ContentHeadings';
import ContentNavigation, { computeContentSections } from './_components/ContentNavigation';
import ContentProse from './_components/ContentProse';

export async function getStaticPaths() {
  return {
    paths: ['/', ...allDocuments.map((doc) => doc.path)],
    fallback: false,
  };
}


export async function getStaticProps({ params }: GetStaticPropsContext<{ slug: string[] }>) {
  const path = `/${params?.slug?.join('/') ?? ''}`;
  const post = allDocuments.find((p) => p.path === path)!;
  return {
    props: {
      post: post ?? allDocuments[0], // post ??
      sections: computeContentSections(allDocuments),
    },
  };
}

// function SchemaOrgDigitalDocument({ post }): JSX.Element {
//   return (
//     <script
//       key="DigitalDocument"
//       {...jsonLdScriptProps<DigitalDocument>({
//         '@context': 'https://schema.org',
//         '@type': 'DigitalDocument',
//         name: post.title,
//         author: process.env.SITE_NAME,
//         description: post.description,
//         url: `${process.env.SITE_URL}${post.path}`,
//       })}
//     />
//   );
// }

export default function PostPage({ post, sections }: InferGetServerSidePropsType<typeof getStaticProps>) {
  const siteTitle = `${post.title} | ${process.env.SITE_NAME}`;
  const canonicalUrl = `${process.env.SITE_URL}${post.path}`;
  const description = truncate(post.description, { length: 220 });

  return (
    <>
      <Head>
        <title key="title">{siteTitle}</title>
        <meta key="og:title" name="og:title" content={siteTitle} />
        <link key="canonical" rel="canonical" href={canonicalUrl} />
        <meta key="og:url" name="og:url" content={canonicalUrl} />
        {/* <SchemaOrgDigitalDocument post={post} /> */}

        {description && (
          <>
            <meta key="description" name="description" content={description} />
            <meta key="og:description" name="og:description" content={description} />
          </>
        )}
      </Head>

      <div className="relative mx-auto flex max-w-8xl justify-center sm:px-2 lg:px-8 xl:px-12">
        <div className="hidden lg:relative lg:block lg:flex-none">
          <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden" />
          <div className="sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] overflow-y-auto py-16 pl-0.5">
            <div className="absolute top-16 bottom-0 right-0 hidden h-12 w-px bg-gradient-to-t from-slate-800 dark:block" />
            <div className="absolute top-28 bottom-0 right-0 hidden w-px bg-slate-800 dark:block" />
            <ContentNavigation sections={sections} className="w-64 pr-8 xl:w-72 xl:pr-16" />
          </div>
        </div>
        <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
          <article>
            <ContentProse>
              <h1>{post.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: post.body.html }} />
            </ContentProse>
          </article>
        </div>

        <div className="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
          <nav aria-labelledby="on-this-page-title" className="w-56">
            <ContentHeadings contentHeadings={post.contentHeadings} />
          </nav>
        </div>
      </div>
    </>
  );
}