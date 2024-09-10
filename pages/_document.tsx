import React from 'react';
// eslint-disable-next-line @next/next/no-document-import-in-page
import { Html, Head, Main, NextScript } from 'next/document';

function Document() {
  return (
    <Html>
      <Head>
        <script async type="text/javascript" src="/js/newrelic-browser.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;
