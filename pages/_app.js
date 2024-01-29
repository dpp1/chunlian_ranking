import React, {useEffect, useState} from 'react';
import '../src/App.css';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import '../src/components/chatBotCouplet/index.css';
import '../src/index.css';
import reportWebVitals from '../src/reportWebVitals';
import { Amplify } from 'aws-amplify';
import amplifyconfig from '../src/amplifyconfiguration.json';
import Head from 'next/head';
import GlobalContext from '@/src/globalContext';

Amplify.configure(amplifyconfig);

function MyApp({ Component, pageProps }) {
  const [globalValues, setGlobalValues] = useState({
    userUUID: null,
    isFromBooth: false,
  });

  useEffect(() => {
    // Generate or retrieve userUUID
    let userUUID = Cookies.get('userUUID');
    if (!userUUID) {
      userUUID = uuidv4();
      Cookies.set('userUUID', userUUID);
    }
    console.log('userUUID', userUUID);

    // Check for is_from_booth in the URL query parameters
    const isFromBooth = typeof window !== 'undefined' ?
        new URLSearchParams(window.location.search).get('is_from_booth') === 'true' : false;
    console.log("isFromBooth: ", isFromBooth);
    // Update the global values
    setGlobalValues({ userUUID, isFromBooth });
  }, []);

  return (
      <GlobalContext.Provider value={globalValues}>
        <Head>
          <title>春联大师</title>
        </Head>
        <RootLayoutThatConfiguresAmplifyOnTheClient>
          <Component {...pageProps} />
        </RootLayoutThatConfiguresAmplifyOnTheClient>
      </GlobalContext.Provider>
  );
}

function RootLayoutThatConfiguresAmplifyOnTheClient({ children }) {
  return <>{children}</>; // This can include additional client-side configurations if needed
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export default MyApp;
