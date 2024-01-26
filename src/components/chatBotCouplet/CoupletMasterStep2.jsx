"use client";
import React, { useState, useEffect } from "react";
import { Layout, Input, Button, Row, Col, TextArea, Typography } from '@douyinfe/semi-ui';
export default function CoupletMasterStep2(props) {
    const { Header } = Layout;
    const { Title } = Typography;
    const [theme, setTheme] = useState(props.theme);

    useEffect(() => {
        setTheme(props.theme);
    }, [props]);

    return <>
        <div className="denglong1"/>
        <div className="denglong2"/>
        <div className="denglong3"/>
        <div className="denglong4"/>
        <Header style={{ height: 150 }}></Header>
        <Row type="flex" justify="center" align="middle">
            <Col span={14} align="center">
                <h1 className="title" align="center">AI春联大师</h1>
                <br/>
                <p align="center" className="desc">说出您龙年的一个心愿，我们为您生成对联</p>
                <input type="text" className="themeInput" value={props.theme} disabled/>
                <p align="center" className="hint">大家在说：“我希望身体健康！”，“祝公司产品大卖！”，“我要脱单！”</p>
            </Col>
        </Row>
    </>;
}
