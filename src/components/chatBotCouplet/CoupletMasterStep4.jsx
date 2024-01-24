"use client";

import React, { useState, useEffect } from "react";
import { Row, Col } from "@douyinfe/semi-ui";
import { CoupletWidget } from './CoupletWidget';
import Cookies from 'js-cookie';
import {v4 as uuidv4} from 'uuid';
import {post} from '@aws-amplify/api';
export default function CoupletMasterStep4(props) {
    /**
     * Submit chunlians to the Cloud
     */
    const submitChunlians = (chunlianList) => {
        if (chunlianList.length === 0) {
            console.log("No Chunlians to submit")
            return;
        }
        const userUUID = Cookies.get('userUUID');
        chunlianList.forEach(chunlian => {
            try {
                const requestBody = {
                    firstLine: chunlian.shanglian,
                    secondLine: chunlian.xialian,
                    horizontalScroll: chunlian.hengpi,
                    topic: props.theme,
                    userId: userUUID,
                    chunlianId: uuidv4().toString(),
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
        });
    }
    submitChunlians(props.chunlians)
    // const [attempts, setAttempts] = useState(1);
    const [chunlians, setChunlians] = useState([]);
    const [chunlian1, setChunlian1] = useState({hengpi : "", shanglian : "", xialian: "" });
    const [chunlian2, setChunlian2] = useState({hengpi : "", shanglian : "", xialian: "" });
    const [chunlian3, setChunlian3] = useState({hengpi : "", shanglian : "", xialian: "" });
    // const [chunlian1, setChunlian1] = useState({ hengpi: "奋勇拼搏", shanglian: "发愤图强兴大业", xialian: "勤劳致富建小康" });
    // const [chunlian2, setChunlian2] = useState({ hengpi: "勇往直前", shanglian: "长风破浪会有时", xialian: "直挂云帆济沧海" });
    // const [chunlian3, setChunlian3] = useState({ hengpi: "中国福彩", shanglian: "早中晚中早晚中", xialian: "多买少买多少买" });

    useEffect(() => {
        // setAttempts(props.attempts);
        setChunlians(props.chunlians);
        // console.log(props.attempts);
        console.log(props.chunlians);
        setChunlian1(props.chunlians[0]);
        setChunlian2(props.chunlians[1]);
        setChunlian3(props.chunlians[2]);
    }, [props]);

    return <><Row type="flex" justify="center">
        <Col span={6} >
            <CoupletWidget coupletTop={chunlian1.hengpi} coupletLeft={chunlian1.shanglian} coupletRight={chunlian1.xialian} font="OrdinaryFont" background="coupletReview" />
            <div align="center" className="hint">传统</div>
        </Col>
        <Col span={6} >
            <CoupletWidget coupletTop={chunlian2.hengpi} coupletLeft={chunlian2.shanglian} coupletRight={chunlian2.xialian} font="OrdinaryFont" background="coupletReview"/>
            <div align="center" className="hint">古典</div>
        </Col>
        <Col span={6} >
            <CoupletWidget coupletTop={chunlian3.hengpi} coupletLeft={chunlian3.shanglian} coupletRight={chunlian3.xialian} font="OrdinaryFont" background="coupletReview"/>
            <div align="center" className="hint">搞笑</div>
        </Col>
    </Row>
    </>;
}
