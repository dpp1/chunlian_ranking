"use client";

import React, { useState, useEffect, useRef } from "react";
import { CoupletWidget } from "./CoupletWidget";
import { Row, Col, Layout, Button } from "@douyinfe/semi-ui";
import { useReactToPrint } from 'react-to-print';

export default function CoupletMasterStep5(props) {

    const { Header } = Layout;
    const [chunlian, setChunlian] = useState({ hengpi: "", shanglian: "", xialian: "" });
    // const [chunlian, setChunlian] = useState({ hengpi: "喜迎新春", shanglian: "莺歌燕舞新春日", xialian: "虎跃龙腾大治年" });

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });

    useEffect(() => {
        console.log(props.attempts);
        console.log(props.chunlians);
        setChunlian(props.chunlians[props.selection]);
        // setChunlian({ hengpi: "喜迎新春", shanglian: "莺歌燕舞新春日", xialian: "虎跃龙腾大治年" })

        // const timeoutId = setTimeout(() => {
        //     window.location.reload();
        // }, '15000');
        // return () => clearTimeout(timeoutId);

    }, [props]);

    return <>
        <Header style={{ height: 50 }}></Header>
        <Row type="flex" align="middle">
            <Col span={7} offset={5}>
                <CoupletWidget ref={componentRef} coupletTop={chunlian.hengpi} coupletLeft={chunlian.shanglian} coupletRight={chunlian.xialian} font="OrdinaryFont"  background="coupletPrinter"/>
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
                <br/>
                <div className="qrCode"/>
                <Button onClick={handlePrint} theme='solid'>打印春联</Button>
            </Col>
        </Row>
    </>;
}