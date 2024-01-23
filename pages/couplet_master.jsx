"use client";

import CoupletMasterStep1 from "../src/components/chatBotCouplet/CoupletMasterStep1";
import CoupletMasterStep2 from "../src/components/chatBotCouplet/CoupletMasterStep2";
import CoupletMasterStep3 from "../src/components/chatBotCouplet/CoupletMasterStep3";
import CoupletMasterStep4 from "../src/components/chatBotCouplet/CoupletMasterStep4";
import CoupletMasterStep5 from "../src/components/chatBotCouplet/CoupletMasterStep5";
import React, { useState, useEffect } from "react";
import GlobalConfig from "../src/backend_endpoint_config";
import { Layout, Card, Breadcrumb, Button, Space, Tag, Row, Col, Input } from "@douyinfe/semi-ui";
export default function CoupletMasterComponent() {
    /**
     * 1 : SET_THEME
     * 2 : CONFIRM_THEME
     * 3 : CHUNLIAN_GEN
     * 4 : CHUNLIAN_REVIEW
     * 5 : PRINT
     */
    const [visibleStep, setStep] = useState(5);
    const [backgroundClassName, setBackground] = useState();
    const [voice, setVoice] = useState("");
    const [conversation, setConversation] = useState([]);

    const hints = [
        "", 
        "", 
        "点击桌面话筒按钮开始说话，说完之后再点击一次结束", 
        "对联正在生成中，请稍等", 
        "选择并打印你喜欢的对联，例如“打印第二幅”。您还可以更换新年愿望，请说“再来一次”", 
        ""
    ]

    const [theme, setTheme] = useState([]);
    const [attempts, setAttempts] = useState();
    const [selection, setSelection] = useState();
    const [chunlians, setChunlians] = useState([]);

    const { Header, Footer, Content, Sider } = Layout;
    const endpoint = "/chatbot_couplet_master";
    const api = `${GlobalConfig.apiHost}:${GlobalConfig.apiPort}${endpoint}`;

    const extractPrompt = (body) => {
        let conversationBuilder = '';
        for (const message of body) {
            conversationBuilder += `${message.sender}: ${message.message}\n\n`;
        }
        return conversationBuilder.trim();
    }

    useEffect(() => {
        setBackground('background' + visibleStep);
    }, [visibleStep]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            sendMessage(voice);
        }, '3000');
        return () => clearTimeout(timeoutId);
    }, [voice]);

    const sendMessage = async (voice) => {

        if(voice === '写春联' && visibleStep === 1){
            setStep(2);
            setVoice('');
            return;
        }

        if(voice === '确认' && visibleStep === 2){
            setStep(3);
            setVoice('');
            sendMessage('Generate');
            return;
        }

        const newMessage = { sender: "Human", message: voice };
        setConversation(prevConversation => [...prevConversation, newMessage]);
        setVoice('');

        try {
            const message = extractPrompt([...conversation, newMessage]);
            const response = await fetch(api, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            await response.json().then(data => {
                console.log(data.result);
                setConversation(prevConversation => [...prevConversation, {
                    sender: "Assistant",
                    message: data.result
                }]);
                const response = JSON.parse(data.result);
                // routing
                const next_step = response.next_step;
                console.log('next_step : ' + next_step);
                if(next_step === 'CONFIRM_THEME'){
                    console.log(response.theme);
                    setTheme(response.theme);
                    setStep(2);
                }
                if(next_step === 'CHUNLIAN_GEN'){
                    setStep(3);
                    sendMessage('Generate');
                }
                if(next_step === 'CHUNLIAN_REVIEW'){
                    setAttempts(response.attempts);
                    setChunlians(response.chunlians);
                    setStep(4);
                }
                if(next_step === 'PRINT'){
                    setAttempts(response.attempts);
                    setChunlians(response.chunlians);
                    setSelection(response.selection);
                    setStep(5);
                }

            });

        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <Layout className={backgroundClassName}>
            <Content >
                {visibleStep === 1 && <CoupletMasterStep1 />}
                {visibleStep === 2 && <CoupletMasterStep2 theme={theme}/>}
                {visibleStep === 3 && <CoupletMasterStep3 />}
                {visibleStep === 4 && <CoupletMasterStep4 attempts={attempts} chunlians={chunlians}/>}
                {visibleStep === 5 && <CoupletMasterStep5 attempts={attempts} chunlians={chunlians} selection={selection}/>}
            </Content>
            <Footer>
                <Layout>
                    <Content>
                        <Row type="flex" justify="center">
                            <Col align="middle" className="hint">
                                {hints[visibleStep]}
                            </Col>
                        </Row>
                        <br/>
                        <Row type="flex" justify="center" gutter={8}>
                            <Col align="right" span={1}>
                                <div className="audioIcon"/>
                            </Col>
                            <Col align="middle" span={12}>
                                <Input size='large' className="voiceInput"  value={voice} validateStatus='warning'
                                    onChange={(value, e) => { setVoice(value) }}
                                ></Input>
                            </Col>
                        </Row>
                        <br/>
                    </Content>
                </Layout>
            </Footer>
        </Layout>
    );
}