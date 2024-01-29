import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import Head from "next/head";

const SharePage = () => {
    const router = useRouter();
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        // Extract imageUrl from query parameters
        const queryImageUrl = router.query.imageUrl;
        // Perform validation and set the imageUrl
        if (queryImageUrl && typeof queryImageUrl === 'string') {
            if (queryImageUrl.startsWith('http') && !queryImageUrl.startsWith('https://d1d2ukegmn3q96.cloudfront.net')) {
                console.error('Invalid URL');
            } else {
                setImageUrl(queryImageUrl);
            }
        }
    }, [router.query]);

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>来看看我用AI写的春联吧</title>
            </Head>
            <body>
            <main>
                <div id="container">
                    <div className="share">
                        <img id="share-img" src={imageUrl} alt="Shared Content"/>
                    </div>
                    <div className="btn-group">
                        <div id="save-btn">长按上方图片下载</div>
                        {/* Add more buttons here */}
                    </div>
                </div>

            </main>
            </body>
            <style jsx>{`
              @font-face {
                font-family: 'AmazonEmber-Regular';
                src: url('https://d1d2ukegmn3q96.cloudfront.net/fonts/AmazonEmber_Rg.ttf') format('truetype');
              }

              @font-face {
                font-family: 'AmazonEmber-Bold';
                src: url('https://d1d2ukegmn3q96.cloudfront.net/fonts/AmazonEmber_Bd.ttf') format('truetype');
              }

              h1, h2, h3, h4 {
                font-family: 'AmazonEmber-Bold';
              }

              body {
                background: linear-gradient(44deg, #5506FF 32.15%, #8E105C 64.93%, #CB1B1B 92.72%);
                min-height: 100vh;
                font-family: 'AmazonEmber-Regular';
                margin: 0px;
              }

              .share {
                position: relative;
                box-sizing: border-box;
                line-height: 0;
                border-radius: 2%;
                overflow: hidden;
              }

              main {
                margin-top: 3%;
                max-width: 768px;
                margin: auto;
              }

              #container {
                margin: 10px;
              }

              .share #share-img {
                width: 100%;
                display: block;
                margin: 0;
                padding: 0;
                border: none;
              }

              .btn-group {
                display: flex;
                justify-content: center;
                color: white;
              }

              .btn-group div {
                padding: 8px 22px;
                margin: 15px;
                text-align: center;
              }
            `}</style>
        </>
    );
};

export default SharePage;
