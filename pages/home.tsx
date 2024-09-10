import React, { useState } from 'react';
import { Image, Segment } from 'semantic-ui-react';
import Title from '../components/Title';
import useInitialAuth from '../lib/hooks/useInitialAuth';
import { useRouter } from 'next/router';
import ButtonChar from '../components/ButtonChar';

const PAGE_TITLE = 'Home';

const Home = () => {
  const { asPath, pathname } = useRouter();
  useInitialAuth(asPath || pathname);
  return (
    <div>
    <Title title="Home" />
    <Segment className="ui centered two column grid no-shadow">
      <div>
        <Image
          alt="Welcome"
          src="/images/welcome.jpeg"
          size="large"
          style={{ margin: 30 }}
        />
      </div>
      <div className="row" style={{ marginBottom: -20 }}>
        <h1>Welcome</h1>
      </div>
      <div className="row" style={{ marginBottom: -20 }}>
        <p>Your personalized management system is now ready for you</p>
      </div>
      <div className="row" style={{ marginTop: 40 }}>
        <h2>Tasks to Complete</h2>
      </div>
      <div className="ui equal width grid" style={{ display: 'flex' }}>
        <div className="row">
          <Segment className="column" style={{ margin: '10px 10px 10px 20px' }}>
            {['Goal Setting', 'Mid Year Coaching', 'End Year Coaching'].map((label) => (
              <ButtonChar key={label} label={label} link={''} char={''} />
            ))}
          </Segment>
        </div>
      </div>
    </Segment>
  </div>  
  );
};


export default Home;
