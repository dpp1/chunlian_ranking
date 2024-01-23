"use client";

import React, { useState } from "react";
import { Layout, Row, Col } from '@douyinfe/semi-ui';
export default function CoupletMasterStep3() {
    const { Header, Footer, Content, Sider } = Layout;

    return (
        <Row type="flex" justify="center" align="middle">
            <Col span={8}>
                <Header style={{ height: 400 }}></Header>
                <h1 className="title" align="center">AI春联大师</h1>
                <p className="desc" align="center">春联生成中</p>
            </Col>
        </Row>
    )
}
