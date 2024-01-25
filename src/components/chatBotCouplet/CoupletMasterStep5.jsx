"use client";

import React, { useState, useEffect, useRef } from "react";
import { CoupletWidget } from "./CoupletWidget";
import {
    Row,
    Col,
    Layout,
    Button,
    Space,
    Typography,
    Input, Toast,
} from '@douyinfe/semi-ui';
import { useReactToPrint } from 'react-to-print';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { v5 as uuidv5 } from 'uuid';
import { post } from '@aws-amplify/api';
import { ImageUploader } from './ImageUploader';
import * as htmlToImage from 'html-to-image';
import QRCode from "react-qr-code";

const MY_NAMESPACE = '86824965-20d1-49d2-a222-ac1c3bd0738c'

export default function CoupletMasterStep5(props) {
    const router = useRouter();
    // Function to handle redirection to the main path
    const redirectToHome = () => {
        router.push('/');
    };

    const { Header } = Layout;
    const { Title } = Typography;
    const [shareURL, setShareURL] = useState('');
    const [chunlian, setChunlian] = useState({ hengpi: "", shanglian: "", xialian: "" });
    const [name, setName] = useState('');
    // Whether the Chunlian is submitted
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        console.log(props.attempts);
        console.log(props.chunlians);
        setChunlian(props.chunlians[props.selection]);
        // setChunlian({ hengpi: "喜迎新春", shanglian: "莺歌燕舞新春日", xialian: "虎跃龙腾大治年" });
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
                // 分享图片地址
                const shareURL = 'https://d1d2ukegmn3q96.cloudfront.net/share/index.html?combine=false&imageUrl=' + imagePath;
                setShareURL(shareURL);
                setLoading(false);
            })
        })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
    };

    return <>
        <Header style={{ height: 20 }}></Header>
        <Row type="flex" align="middle" gutter={16}>
            <Col span={7} offset={5}>
                <CoupletWidget ref={componentRef} coupletTop={chunlian.hengpi} coupletLeft={chunlian.shanglian} coupletRight={chunlian.xialian} font="OrdinaryFont" background="coupletPrinter" />
            </Col>
            <Col span={6} offset={1} >
                <div className="hint" >
                    <div>
                        对联正在打印中
                    </div>
                    <div className="hint">
                        打印后，现场的书法家
                    </div>
                    <div className="hint">
                        将为您挥毫泼墨！
                    </div>
                    <br />
                </div>
                <div>
                    {loading && <>
                        <div className="loading" />
                    </>}
                    {!loading &&
                        <>
                            <div className="hint">
                                手机扫一扫，分享这份喜悦
                            </div>
                            <br />
                            <div style={{ height: "auto", maxWidth: 180, width: "100%" }} align="left">
                                <QRCode
                                    size={256}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    value={shareURL}
                                    viewBox={`0 0 256 256`}
                                />
                            </div>
                        </>
                    }
                </div>
                <br />
                <div>
                    <Space>
                        <Button onClick={refreshPage} type='secondary' theme='solid' size="large">再玩一次</Button>
                        <Button onClick={handlePrint} type='tertiary' theme='solid' size="large">打印春联</Button>
                        {/* <Button onClick={genQrCode} type='secondary' theme='solid' size="large">生成二维码</Button> */}
                        {/* <Title heading={6} style={{ margin: 8 }}>自动打印</Title> */}
                        {/* <Switch checked={autoPrint} onChange={setAutoPrint} checkedText="开" uncheckedText="关" size="large" /> */}
                    </Space>
                </div>
                <br />     
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
