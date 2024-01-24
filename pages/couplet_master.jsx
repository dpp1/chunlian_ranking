"use client";

import CoupletMasterStep1 from "../src/components/chatBotCouplet/CoupletMasterStep1";
import CoupletMasterStep2 from "../src/components/chatBotCouplet/CoupletMasterStep2";
import CoupletMasterStep3 from "../src/components/chatBotCouplet/CoupletMasterStep3";
import CoupletMasterStep4 from "../src/components/chatBotCouplet/CoupletMasterStep4";
import CoupletMasterStep5 from "../src/components/chatBotCouplet/CoupletMasterStep5";
import React, { useState, useEffect } from "react";
import GlobalConfig from "../src/backend_endpoint_config";
import { Layout, Card, Breadcrumb, Button, Space, Tag, Row, Col, Input } from "@douyinfe/semi-ui";
import {get, post} from '@aws-amplify/api';

export default function CoupletMasterComponent() {
    /**
     * 1 : SET_THEME
     * 2 : CONFIRM_THEME
     * 3 : CHUNLIAN_GEN
     * 4 : CHUNLIAN_REVIEW
     * 5 : PRINT
     */
    const [visibleStep, setStep] = useState(2);
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

    const [theme, setTheme] = useState('');
    const [attempts, setAttempts] = useState(1);
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
        if(voice){
            const timeoutId = setTimeout(() => {
                sendMessage(voice);
            }, '3000');
            return () => clearTimeout(timeoutId);
        }
    }, [voice]);

    const sendMessage = async (voice) => {
        console.log('send message -> ' + voice);
        if(!voice){
            return;
        }

        // if(voice === '写春联' && visibleStep === 1){
        //     setStep(2);
        //     setVoice('');
        //     return;
        // }

        // if(voice === '确认' && visibleStep === 2){
        //     setStep(3);
        //     setVoice('');
        //     sendMessage('Generate');
        //     return;
        // }

        let messageFromVoice = '';
        console.log('visibleStep : ' + visibleStep);
        if(visibleStep === 2){
            messageFromVoice = 'theme is ' + voice;
        } else if(visibleStep === 3){
            messageFromVoice = voice;
        } else if(visibleStep === 4){
            messageFromVoice = JSON.stringify({ "feedback": voice, "attempt":  attempts});
        } else {
            return;
        }

        // const newMessage = { sender: "Human", message: messageFromVoice };
        // setConversation(prevConversation => [...prevConversation, newMessage]);
        setVoice('');

        try {
            // const message = extractPrompt([...conversation, newMessage]);
            console.log('sending prompt -> ' + messageFromVoice);

            const restOperation = post({
                apiName: 'chunliansApi',
                path: `/chunlian-master`,
                options: {
                    headers: { 'Content-Type': 'application/json' },
                    body: { prompt: messageFromVoice }
                }
            });
            const { response } = await restOperation.response;
            await response.json().then(data => {
                console.log(data.result);
                setConversation(prevConversation => [...prevConversation, {
                    sender: "Assistant",
                    message: data.result
                }]);

                // fetch json out incase output is not just a json
                const leftBracketIndex = data.result.indexOf('{');
                const rightBracketIndex = data.result.lastIndexOf('}');
                console.log(data.result.substring(leftBracketIndex, rightBracketIndex + 1));

                const response = JSON.parse(data.result.substring(leftBracketIndex, rightBracketIndex + 1));
                // routing
                const next_step = response.next_step;
                console.log('next_step : ' + next_step);
                if(next_step === 'SET_THEME'){
                    setStep(2);
                }
                if(next_step === 'CHUNLIAN_GEN'){
                    setStep(3);
                    sendMessage('Generate for theme ' + response.theme);
                }
                if(next_step === 'CHUNLIAN_REVIEW'){
                    setAttempts(attempts + 1);
                    setChunlians(response.chunlians);
                    setStep(4);
                }
                if(next_step === 'PRINT'){
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
            <Header className="header" align="right" >亚马逊云科技Marketing Tech荣誉出品</Header>
            <Content >
                {visibleStep === 1 && <CoupletMasterStep1 />}
                {visibleStep === 2 && <CoupletMasterStep2 theme={theme}/>}
                {visibleStep === 3 && <CoupletMasterStep3 theme={theme}/>}
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
                                    onChange={(value, e) => {
                                        setVoice(value);
                                        if(visibleStep === 2){
                                            setTheme(value);
                                        }
                                    }}
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
