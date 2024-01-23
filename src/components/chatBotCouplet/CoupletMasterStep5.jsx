"use client";

import React, { useState, useEffect } from "react";
import CoupletWidget from "./CoupletWidget";
import { Row, Col, Layout } from "@douyinfe/semi-ui";
export default function CoupletMasterStep5(props) {

    const { Header } = Layout;
    const [chunlian, setChunlian] = useState({ hengpi: "喜迎新春", shanglian: "莺歌燕舞新春日", xialian: "虎跃龙腾大治年" });

    useEffect(() => {
        console.log(props.attempts);
        console.log(props.chunlians);
        // setChunlian(props.chunlians[props.attempts - 1][props.selection - 1]);

        // const timeoutId = setTimeout(() => {
        //     window.location.reload();
        // }, '15000');
        // return () => clearTimeout(timeoutId);

    }, [props]);

    return <>
        <Header style={{ height: 50 }}></Header>
        <Row type="flex" align="middle">
            <Col span={7} offset={5}>
                <CoupletWidget coupletTop={chunlian.hengpi} coupletLeft={chunlian.shanglian} coupletRight={chunlian.xialian} font="FunFont"  background="coupletPrinter"/>
            </Col>
            <Col span={6} offset={1} className="hint" >
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
                <div className="hint">
                    手机扫一扫，分享这份喜悦
                </div>
                <div className="qrCode">
                    
                </div>
                <div className="hint">
                    15秒钟之后，服务下一位顾客
                </div>
            </Col>
        </Row>
    </>;
}