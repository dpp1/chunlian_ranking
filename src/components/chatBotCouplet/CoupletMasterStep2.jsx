"use client";
import React, {useState, useEffect, useRef} from 'react';
import { Layout, Input, Button, Row, Col, TextArea, Typography } from '@douyinfe/semi-ui';
import VoiceInput from '@/src/components/chatBotCouplet/VoiceInput';

export default function CoupletMasterStep2(props) {
    const voiceInputRef = useRef(null);
    const { Header } = Layout;
    const { Title } = Typography;

    useEffect(() => {
        if (voiceInputRef.current) {
            voiceInputRef.current.focus();
        }
    }, [props]);

    return <>
        <div className="denglong1"/>
        <div className="denglong2"/>
        <div className="denglong3"/>
        <div className="denglong4"/>
        <Header style={{ height: 150 }}></Header>
        <Row type="flex" justify="center" align="middle">
            <Col span={10} align="center">
                <h1 className="title" align="center">AI春联大师</h1>
                <br/>
                <p align="center" className="desc">说出您的龙年心愿</p>
                <p align="center" className="hint">(点击话筒按钮说话 说完后再点一次按钮结束)</p>
                <div>
                    <VoiceInput
                        ref={voiceInputRef}
                        value={props.voice}
                        onValueChange={props.setVoice}
                        visible={true}
                        setTheme={props.setTheme}
                    />
                </div>
                <p align="center" className="hint">大家在说：“我希望身体健康！”，“祝公司产品大卖！”，“我要脱单！”</p>
            </Col>
        </Row>
    </>;
}
