"use client";
import React, {useState, useEffect, useRef, useContext} from 'react';
import { Layout, Input, Button, Row, Col, TextArea, Typography } from '@douyinfe/semi-ui';
import VoiceInput from '@/src/components/chatBotCouplet/VoiceInput';
import {useMediaQuery} from "react-responsive";
import {isMobile} from "react-device-detect";
import GlobalContext from "@/src/globalContext";

export default function CoupletMasterStep2(props) {
    const voiceInputRef = useRef(null);
    const { Header } = Layout;
    const { Title } = Typography;
    const formRef = useRef(null);
    const { userUUID, isFromBooth } = useContext(GlobalContext);

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
        <Header className="step2Header"></Header>
        <Row className="firstElementAfterHeader" type="flex" justify="center" align="middle">
            <Col span={18} align="center">
                <h1 className="title" align="center">春联大师</h1>
                <br/>
                <p align="center" className="desc">留下您的龙年心愿</p>
                {isFromBooth && (
                    <p align="center" className="hint">(点击话筒按钮说话 说完后再点一次按钮结束)</p>
                )}
                <div>
                    <VoiceInput
                        ref={voiceInputRef}
                        formRef={formRef}
                        value={props.voice}
                        onValueChange={props.setVoice}
                        visible={true}
                        sendMessage={props.sendMessage}
                        setTheme={props.setTheme}
                        buttonConfig={{
                            primaryButtonText: "写春联",
                            secondaryButtonText: "随便",
                            secondaryButtonAction: () => {
                                props.setVoice('随便');
                                props.setTheme('随便');
                                props.sendMessage('随便');
                            }
                        }}
                    />
                </div>
                <p align="center" className="hint">大家在说：“我希望身体健康！”，“祝公司产品大卖！”，“我要脱单！”</p>
            </Col>
        </Row>
    </>;
}
