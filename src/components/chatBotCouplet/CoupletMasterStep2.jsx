"use client";
import React, { useState, useEffect } from "react";
import { Layout, Input, Button, Row, Col, TextArea } from '@douyinfe/semi-ui';
export default function CoupletMasterStep2(props) {
    const { Header } = Layout;
    // const [theme, setTheme] = useState(props.theme);

    // useEffect(() => {
    //     setTheme(props.theme);
    // }, [props]);

    return <>
        <div className="denglong1"/>
        <div className="denglong2"/>
        <div className="denglong3"/>
        <div className="denglong4"/>
        <Header style={{ height: 550 }}></Header>
        <Row type="flex" justify="center" align="middle">
            <Col span={14} align="center">
                <Input placeholder='' size='large' className="themeInput" validateStatus='warning' value={props.theme}></Input>
                <p align="center" className="hint">大家在说：“我希望身体健康！”，“祝公司产品大卖！”，“我要脱单！”</p>
            </Col>
        </Row>
    </>;
}
