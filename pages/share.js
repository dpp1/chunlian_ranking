import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import Head from "next/head";
import {Button, Col, Input, Row, Toast} from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import {MY_NAMESPACE} from "@/src/components/chatBotCouplet/CoupletMasterStep5";
import {v5 as uuidv5} from 'uuid';
import {post} from "@aws-amplify/api";

const SharePage = () => {
    const router = useRouter();
    const [imageUrl, setImageUrl] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [chunlian, setChunlian] = useState({});
    const [topic, setTopic] = useState('');
    const [author, setAuthor] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

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
        const queryShowForm = router.query.showForm === 'true';
        setShowForm(queryShowForm);

        if (router.query.topic !== undefined) {
            const topic = decodeURIComponent(router.query.topic);
            setTopic(topic);
        }

        if (router.query.firstLine !== undefined
            && router.query.secondLine !== undefined
            && router.query.horizontalScroll !== undefined) {
            const chunlianData = {
                firstLine: decodeURIComponent(router.query.firstLine),
                secondLine: decodeURIComponent(router.query.secondLine),
                horizontalScroll: decodeURIComponent(router.query.horizontalScroll)
            }
            setChunlian(chunlianData);
        }
    }, [router.query]);

    /**
     * Submit chunlians to the Cloud
     */
    const submitChunlians = () => {
        if (chunlian === undefined) {
            console.error("No Chunlians to submit")
            return;
        }
        if (author === undefined) {
            console.error("Author is undefined")
            return;
        }
        const userUUID = Cookies.get('userUUID');
        try {
            const requestBody = {
                firstLine: chunlian.firstLine,
                secondLine: chunlian.secondLine,
                horizontalScroll: chunlian.horizontalScroll,
                topic: topic,
                userId: userUUID,
                author: author,
                chunlianId: uuidv5(JSON.stringify(chunlian), MY_NAMESPACE).toString(),
                likesCount: 0,
                creationDate: Date.now(),
                shareURL: `https://www.couplet.octopus.marketing.aws.a2z.org.cn/share?combine=false&imageUrl=${encodeURIComponent(imageUrl)}`
            };
            console.log('New Chunlian Request: ', requestBody);
            post({
                apiName: 'chunliansApi',
                path: '/chunlians',
                options: {
                    body: requestBody,
                },
            });
        } catch (error) {
            console.error('Error submitting Chunlian', error);
        }
        setIsSubmitted(true);
    }

    const handleNameSubmit = () => {
        // Simple validation for name length
        if (author.length < 2 || author.length > 10) {
            Toast.error("Name must be between 2 and 10 characters");
            return;
        }
        console.log("Submitted name:", author);
        submitChunlians(author);
    }

    const redirectToHome = () => {
        router.push('/?orderBy=new');
    };

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>来看看我用AI写的春联吧</title>
            </Head>
            <body>
            <h1 style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
                My Hidden Page Title for Accessibility
            </h1>
            <main>
                <div id="container">
                    <div className="share">
                        <img id="share-img" src={imageUrl} alt="Shared Content"/>
                    </div>
                    <div className="btn-group">
                        <div id="save-btn">长按上方图片下载</div>
                        {/* Add more buttons here */}
                    </div>
                    <Row type="flex" justify="center">
                        <Col span={24}>
                            <div align="center">
                                {showForm && !isSubmitted &&
                                    <>
                                        <div>
                                            <p style={{color: "white"}}>提交并转发 得PhoneTool Icon!</p>
                                            <p style={{color: "white"}}>填入你的笔名提交大作(不要用真名哦)</p>
                                        </div>
                                        <Input
                                            value={author}
                                            style={{marginTop: '20px', width: '80%', background: "white"}}
                                            onChange={(e) => setAuthor(e)}
                                            placeholder="春联大师"
                                        />
                                        <Button onClick={handleNameSubmit} theme='solid' type='warning'
                                                size="large" style={{marginTop:'20px'}}>提交大作</Button>
                                    </>
                                }

                                {showForm && isSubmitted &&
                                    // Show submission message if submitted
                                    <div>
                                        <p style={{color: "white"}}>大作已提交到排行榜!</p>
                                        <p style={{color: "white"}}>点击微信右上角转发</p>
                                    </div>
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col span={24}>
                            <div align="center">
                                <Button onClick={redirectToHome} theme='solid' type='warning'
                                        size="large" style={{marginTop:'20px', marginBottom:'10px'}}>查看春联排行榜</Button>
                            </div>
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col span={24}>
                            <div align="center">
                                <Button onClick={redirectToHome} theme='solid' type='warning'
                                        size="large" style={{marginTop:'20px', marginBottom:'10px'}}>创作更多春联</Button>
                            </div>
                        </Col>
                    </Row>
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
