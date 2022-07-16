// noinspection ES6PreferShortImport
import truncate from 'lodash/truncate';
import mermaid from 'mermaid';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { allDocuments } from '../../.contentlayer/generated';
import ContentHeadings from './_components/ContentHeadings';
import ContentNavigation, { computeContentSections } from './_components/ContentNavigation';
import ContentProse from './_components/ContentProse';
import { useTheme } from './_components/ThemeContext';

export async function getStaticPaths() {
  return {
    paths: ['/', ...allDocuments.map((doc) => doc.path)],
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const path = `/${params?.slug?.join('/') ?? ''}`;
  const doc = allDocuments.find((p) => p.path === path);
  return {
    props: {
      doc: doc ?? allDocuments[0],
      sections: computeContentSections(allDocuments),
    },
  };
}

export default function SlugPage({ doc, sections }) {
  const siteTitle = `${doc.title} | ${process.env.SITE_NAME}`;
  const canonicalUrl = `${process.env.SITE_URL}${doc.path}`;
  const description = truncate(doc?.description, { length: 220 });

  const [isMermaidInit, setIsMermaidInit] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!theme) {
      return;
    }

    if (isMermaidInit) {
      mermaid.init();
    } else {
      mermaid.initialize({ theme });
    }
    setIsMermaidInit(true);
  }, [router.asPath, theme]);

  return (
    <>
      <Head>
        <title key="title">{siteTitle}</title>
        <meta key="og:title" name="og:title" content={siteTitle} />
        <link key="canonical" rel="canonical" href={canonicalUrl} />
        <meta key="og:url" name="og:url" content={canonicalUrl} />

        {description && (
          <>
            <meta key="description" name="description" content={description} />
            <meta key="og:description" name="og:description" content={description} />
          </>
        )}
      </Head>

      <div className="max-w-8xl relative mx-auto flex justify-center sm:px-2 lg:px-8 xl:px-12">
        <div className="hidden lg:relative lg:block lg:flex-none">
          <div className="absolute top-0 bottom-0 right-0 hidden w-px bg-slate-800 dark:block" />
          <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden" />
          <div className="sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] overflow-y-auto py-16 pl-0.5">
            <ContentNavigation sections={sections} className="w-64 pr-8 xl:w-72 xl:pr-16" />
          </div>
        </div>
        <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
          <article>
            <ContentProse>
              <h1>{doc.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: doc.body.html }} />
            </ContentProse>
          </article>
        </div>

        <div className="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
          <nav aria-labelledby="on-this-page-title" className="w-56">
            <ContentHeadings contentHeadings={doc.contentHeadings} tags={doc.tags} />
          </nav>
        </div>
      </div>
    </>
  );
}
