"use client";

import React, {useState, useEffect, useRef} from "react";
import {CoupletWidget} from "./CoupletWidget";
import {
    Row,
    Col,
    Layout,
    Button,
    Space,
    Typography,
    Input, Toast, Descriptions, Card,
} from '@douyinfe/semi-ui';
import {useReactToPrint} from 'react-to-print';
import {useRouter} from 'next/router';
import Cookies from 'js-cookie';
import {v5 as uuidv5} from 'uuid';
import {post} from '@aws-amplify/api';
import {ImageUploader} from './ImageUploader';
import * as htmlToImage from 'html-to-image';
import QRCode from "react-qr-code";
import {useMediaQuery} from "react-responsive";
import {isMobile} from 'react-device-detect';
import Head from "next/head";


const MY_NAMESPACE = '86824965-20d1-49d2-a222-ac1c3bd0738c'

export default function CoupletMasterStep5(props) {

    const router = useRouter();
    // Function to handle redirection to the main path
    const redirectToHome = () => {
        router.push('/');
    };

    const {Header} = Layout;
    const {Title} = Typography;
    const [shareURL, setShareURL] = useState('');
    const [chunlian, setChunlian] = useState({hengpi: "", shanglian: "", xialian: ""});
    const [name, setName] = useState('');
    // Whether the Chunlian is submitted
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);

    const componentRef = useRef();
    const handlePrint = () => {
        window.print();
    };

    useEffect(() => {
        console.log(props.attempts);
        console.log(props.chunlians);
        setChunlian(props.chunlians[props.selection]);
        // setChunlian({ hengpi: "喜迎新春", shanglian: "莺歌燕舞新春日", xialian: "虎跃龙腾大治年" });
        // setChunlian({ hengpi: "福星高照", shanglian: "春风化雨养生成", xialian: "日月互照运自然" });
        //1秒后自动打印
        const timeoutId = setTimeout(() => {
            genQrCode();
            const autoprint = new URLSearchParams(window.location.search).get('autoprint');
            console.log("autoprint : " + autoprint);
            console.log("window.location.hostname : " + window.location.hostname);
            // Check if the hostname is 'localhost' or '127.0.0.1' and autoprint is not 'false'
            if (autoprint === 'true') {
                handlePrint();
            }
        }, '1000');
        return () => clearTimeout(timeoutId);

    }, [props]);

    const refreshPage = () => {
        window.location.reload();
    };

    const isOnMobile = useMediaQuery({maxWidth: 767}) || isMobile;
    console.log("isOnMobile", isOnMobile);

    /**
     * Submit chunlians to the Cloud
     */
    const submitChunlians = () => {
        if (chunlian === undefined) {
            console.error("No Chunlians to submit")
            return;
        }
        if (name === undefined) {
            console.error("Name is undefined")
            return;
        }
        const userUUID = Cookies.get('userUUID');
        try {
            const requestBody = {
                firstLine: chunlian.shanglian,
                secondLine: chunlian.xialian,
                horizontalScroll: chunlian.hengpi,
                topic: props.theme,
                userId: userUUID,
                author: name,
                chunlianId: uuidv5(JSON.stringify(chunlian), MY_NAMESPACE).toString(),
                likesCount: 0,
                creationDate: Date.now()
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
        if (name.length < 2 || name.length > 10) {
            Toast.error("Name must be between 2 and 10 characters");
            return;
        }
        console.log("Submitted name:", name);
        submitChunlians(name);
    }

    //照片
    const genQrCode = () => {
        const element = document.getElementById('coupletPhoto');
        htmlToImage.toPng(element).then(function (dataUrl) {
            var timestamp = (new Date()).valueOf();
            ImageUploader.uploadImage(timestamp, dataUrl.substr(dataUrl.indexOf(',') + 1)).then((imagePath) => {
                console.log(imagePath);
                const shareURL = `https://www.couplet.octopus.marketing.aws.a2z.org.cn/share?combine=false&imageUrl=${encodeURIComponent(imagePath)}`;
                // 分享图片地址
                setShareURL(shareURL);
                setLoading(false);
            })
        })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
    };

    if (isMobile) {
        return <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>来看看我用AI写的春联吧</title>
            </Head>
            <Space vertical>
                <Header className="step4Header"/>
                <div className="hint">
                    恭喜! 您生成的春联是
                </div>
                <Row type="flex" justify="center" style={{marginTop: '20px'}}>
                    <Col span={18}>
                        <Card className="chunlianReviewCard"
                              headerLine={false}
                              style={{
                                  backgroundColor: 'rgba(255,243,195,0.66)'
                              }}>
                            <Descriptions
                                align="center"
                                size="small"
                                row
                                data={[
                                    {key: '上联', value: `${chunlian.shanglian}`},
                                    {key: '下联', value: `${chunlian.xialian}`},
                                    {key: '横批', value: `${chunlian.hengpi}`},
                                ]}
                            />
                            <div style={{
                                margin: '12px 0',
                                display: 'flex',
                                justifyContent: 'center',
                            }}>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col span={24}>
                        <div align="center">
                            {!isSubmitted ? (
                                <>
                                    <div class='hint'>
                                        <p>填入你的笔名提交大作(不要用真名哦)</p>
                                    </div>
                                    <Input
                                        value={name}
                                        style={{marginTop: '20px'}}
                                        onChange={(e) => setName(e)}
                                        placeholder="春联大师"
                                    />
                                    <Button onClick={handleNameSubmit} theme='solid' type='warning'
                                            size="large" style={{marginTop:'20px'}}>提交大作</Button>
                                </>
                            ) : (
                                // Show submission message if submitted
                                <div class='hint'>
                                    <p>大作已提交到排行榜!</p>
                                    <p>微信右上角分享 传播喜悦!</p>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col span={24}>
                        <div align="center">
                            <Button onClick={redirectToHome} theme='solid' type='warning'
                                    size="large" style={{marginTop:'20px', marginBottom:'10px'}}>春联排行榜</Button>
                        </div>
                    </Col>
                </Row>

            </Space>
        </>;
    } else {
        return <>
            <Header style={{height: 100}}></Header>
            <Row type="flex" align="middle" gutter={16}>
                <Col span={7} offset={5} id="printDiv">
                    <CoupletWidget ref={componentRef} coupletTop={chunlian.hengpi} coupletLeft={chunlian.shanglian}
                                   coupletRight={chunlian.xialian} font="OrdinaryFont" background="coupletPrinter"/>
                </Col>
                <Col span={6} offset={1} id="printHint">
                    <div className="hint">
                        <div>
                            对联正在打印中
                        </div>
                        <div className="hint">
                            打印后，现场的书法家
                        </div>
                        <div className="hint">
                            将为您挥毫泼墨！
                        </div>
                        <br/>
                    </div>
                    <div>
                        {loading && <>
                            <div className="hint">
                                正在生成分享二维码。。。
                            </div>
                            <div className="loading"/>
                        </>}
                        {!loading &&
                            <>
                                <div className="hint">
                                    手机扫一扫，分享这份喜悦
                                </div>
                                <br/>
                                <div style={{height: "auto", maxWidth: 180, width: "100%"}} align="left">
                                    <QRCode
                                        size={256}
                                        style={{height: "auto", maxWidth: "100%", width: "100%"}}
                                        value={shareURL}
                                        viewBox={`0 0 256 256`}
                                    />
                                </div>
                            </>
                        }
                    </div>
                    <br/>
                    <div>
                        <Space>
                            <Button onClick={refreshPage} type='secondary' theme='solid' size="large">再玩一次</Button>
                            <Button onClick={handlePrint} type='tertiary' theme='solid' size="large">打印春联</Button>
                            {/* <Button onClick={genQrCode} type='secondary' theme='solid' size="large">生成二维码</Button> */}
                            {/* <Title heading={6} style={{ margin: 8 }}>自动打印</Title> */}
                            {/* <Switch checked={autoPrint} onChange={setAutoPrint} checkedText="开" uncheckedText="关" size="large" /> */}
                        </Space>
                    </div>
                    <br/>
                    <Space>
                        {!isSubmitted ? (
                            <>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e)}
                                    placeholder="填入你的笔名,不要用真名哦~"
                                />
                                <Button onClick={handleNameSubmit} theme='solid' size="large">提交大作</Button>
                            </>
                        ) : (
                            // Show submission message if submitted
                            <p>大作已提交!</p>
                        )}
                        <Button onClick={redirectToHome} theme='solid' type='secondary' size="large">春联排行榜</Button>
                    </Space>
                    <p>点击"春联排行榜"查看更多有趣春联</p>
                </Col>
            </Row>
        </>;
    }
}
