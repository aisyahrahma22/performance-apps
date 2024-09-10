import type { NextPage } from 'next';
import { useSelector } from 'react-redux';
import { authStateSelector } from '../lib/slice/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useInitialAuth from '../lib/hooks/useInitialAuth';

const Root: NextPage = () => {
  const { asPath, pathname } = useRouter();
  useInitialAuth(asPath || pathname);
  const authState = useSelector(authStateSelector);
  const router = useRouter();
  useEffect(() => {
    if (authState.isAuthorized) router.push('/home');
    else router.push('/login');
  }, [authState.isAuthorized, router]);
  return null;
};


export default Root;
