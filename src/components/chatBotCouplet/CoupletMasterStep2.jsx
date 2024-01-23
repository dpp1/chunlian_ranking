"use client";
import React, { useState, useEffect } from "react";
import { Layout, Input, Button, Row, Col } from '@douyinfe/semi-ui';
export default function CoupletMasterStep2(props) {
    const { Header } = Layout;
    const [theme, setTheme] = useState(props.theme[0]);

    useEffect(() => {
        setTheme(props.theme[0]);
    }, [props]);

    return <>
        <div className="denglong1"/>
        <div className="denglong2"/>
        <div className="denglong3"/>
        <div className="denglong4"/>
        <Row type="flex" justify="center" align="middle">
            <Col span={12}>
                <Header style={{ height: 500 }}></Header>
                <div align="center">
                    <Input placeholder='' size='large' className="themeInput" validateStatus='warning' value={theme}
                        onChange={(value, e) => {
                            setTheme(value);
                        }}></Input>
                    <br /><br />
                </div>
            </Col>
        </Row>
    </>;
}
