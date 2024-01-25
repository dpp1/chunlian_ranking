import React, {useEffect, useState} from 'react';
import '../src/App.css';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import '../src/components/chatBotCouplet/index.css';
import '../src/index.css';
import reportWebVitals from '../src/reportWebVitals';
import { Amplify } from 'aws-amplify';
import amplifyconfig from '../src/amplifyconfiguration.json';

Amplify.configure(amplifyconfig);

const ensureUserUUID = () => {
  if (!Cookies.get('userUUID')) {
    Cookies.set('userUUID', uuidv4());
  }
};

function MyApp({ Component, pageProps }) {
  ensureUserUUID();
  return (
      <RootLayoutThatConfiguresAmplifyOnTheClient>
        <Component {...pageProps} />
      </RootLayoutThatConfiguresAmplifyOnTheClient>
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
