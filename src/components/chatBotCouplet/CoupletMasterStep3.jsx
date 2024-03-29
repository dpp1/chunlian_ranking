"use client";

import React, { useState } from "react";
import { Layout, Row, Col } from '@douyinfe/semi-ui';
export default function CoupletMasterStep3(props) {
    const { Header, Footer, Content, Sider } = Layout;

    return (<>
        <Header style={{ height: 200 }}></Header>
        <Row type="flex" justify="center" align="middle">
            <Col span={8} className="hint" align="center">
                <p align="center">AI春联大师正在创作对联 您的心愿是</p>
                <h1 align="center">{props.theme}</h1>
                <div className="loading"  />
            </Col>
        </Row>
    </>
    )
}
