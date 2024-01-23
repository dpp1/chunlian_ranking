"use client";

import React, { useState } from "react";
import { Layout, Row, Col } from '@douyinfe/semi-ui';
import Denglong from './img/灯笼.svg';
export default function CoupletMasterStep1() {
    const { Header, Footer, Content, Sider } = Layout;

    return (
        <Row type="flex" justify="center" align="middle">
            <Col span={8}>
                <Header style={{ height: 400 }}>
                    {/* <Denglong /> */}
                </Header>
                <h1 className="title" align="center">AI春联大师</h1>
                <p className="desc" align="center">请讲“写春联”开始游戏</p>
            </Col>
        </Row>
    )
}
