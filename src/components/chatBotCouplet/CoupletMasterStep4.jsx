"use client";

import React, { useState, useEffect } from "react";
import { Row, Col } from "@douyinfe/semi-ui";
import CoupletWidget from './CoupletWidget';
export default function CoupletMasterStep4(props) {
    const [attempts, setAttempts] = useState(1);
    const [chunlians, setChunlians] = useState([]);
    // const [chunlian1, setChunlian1] = useState({hengpi : "", shanglian : "", xialian: "" });
    // const [chunlian2, setChunlian2] = useState({hengpi : "", shanglian : "", xialian: "" });
    // const [chunlian3, setChunlian3] = useState({hengpi : "", shanglian : "", xialian: "" });
    const [chunlian1, setChunlian1] = useState({ hengpi: "奋勇拼搏", shanglian: "发愤图强兴大业", xialian: "勤劳致富建小康" });
    const [chunlian2, setChunlian2] = useState({ hengpi: "勇往直前", shanglian: "长风破浪会有时", xialian: "直挂云帆济沧海" });
    const [chunlian3, setChunlian3] = useState({ hengpi: "中国福彩", shanglian: "早中晚中早晚中", xialian: "多买少买多少买" });

    useEffect(() => {
        setAttempts(props.attempts);
        setChunlians(props.chunlians);
        console.log(props.attempts);
        console.log(props.chunlians);
        // setChunlian1(props.chunlians[props.attempts - 1][0]);
        // setChunlian2(props.chunlians[props.attempts - 1][1]);
        // setChunlian3(props.chunlians[props.attempts - 1][2]);
    }, [props]);

    return <Row >
        <Col span={8} justify="center">
            <CoupletWidget coupletTop={chunlian1.hengpi} coupletLeft={chunlian1.shanglian} coupletRight={chunlian1.xialian} font="OrdinaryFont" background="coupletReview" />
        </Col>
        <Col span={8} justify="center">
            <CoupletWidget coupletTop={chunlian2.hengpi} coupletLeft={chunlian2.shanglian} coupletRight={chunlian2.xialian} font="ClassicalFont" background="coupletReview"/>
        </Col>
        <Col span={8} justify="center">
            <CoupletWidget coupletTop={chunlian3.hengpi} coupletLeft={chunlian3.shanglian} coupletRight={chunlian3.xialian} font="FunFont" background="coupletReview"/>
        </Col>
    </Row>;
}
