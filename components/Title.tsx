import Head from 'next/head';
import React from 'react';

type TitleProps = {
  title?: string;
  extraComponent?: any;
};
const Title = ({ title, extraComponent }: TitleProps) => {
  return (
    <Head>
      <link rel="shortcut icon" href="/images/myApps.jpeg" />
      <title>{title && `${title} - `}Performance Apps</title>
      {extraComponent}
    </Head>
  );
};

export default Title;
