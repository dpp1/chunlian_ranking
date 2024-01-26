'use client';

import CoupletMasterStep1
  from '../src/components/chatBotCouplet/CoupletMasterStep1';
import CoupletMasterStep2
  from '../src/components/chatBotCouplet/CoupletMasterStep2';
import CoupletMasterStep3
  from '../src/components/chatBotCouplet/CoupletMasterStep3';
import CoupletMasterStep4
  from '../src/components/chatBotCouplet/CoupletMasterStep4';
import CoupletMasterStep5
  from '../src/components/chatBotCouplet/CoupletMasterStep5';
import React, {useState, useEffect, useRef} from 'react';
import {
  Layout,
  Row,
  Col,
  Input,
} from '@douyinfe/semi-ui';
import {post} from '@aws-amplify/api';

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
  const [voice, setVoice] = useState('');
  const voiceInput = useRef(null);

  const steps = ['', '', 'SET_THEME', 'CHUNLIAN_GEN', 'CHUNLIAN_REVIEW', 'PRINT'];

  const hints = [
    '',
    '',
    '点击桌面话筒按钮开始说话，说完之后再点击一次结束',
    '对联正在生成中，请稍等',
    '选择并打印你喜欢的对联，例如“打印第二幅”。您还可以更换新年愿望，请说“再来一次”',
    '',
  ];

  const voiceInputDisabled = [
    false,
    false,
    false,
    true,
    false,
    true,
  ];

  const [theme, setTheme] = useState('');
  const [attempts, setAttempts] = useState(1);
  const [selection, setSelection] = useState();
  const [chunlians, setChunlians] = useState([]);

  const {Header, Footer, Content, Sider} = Layout;

  const extractPrompt = (body) => {
    let conversationBuilder = '';
    for (const message of body) {
      conversationBuilder += `${message.sender}: ${message.message}\n\n`;
    }
    return conversationBuilder.trim();
  };

  useEffect(() => {
    setBackground('background' + visibleStep);
    voiceInput.current.focus();
  }, [visibleStep]);

  useEffect(() => {
    if (voice) {
      const timeoutId = setTimeout(() => {
        sendMessage(voice);
      }, '3000');
      return () => clearTimeout(timeoutId);
    }
  }, [voice]);

  const sendMessage = async (voice) => {
    console.log('send message -> ' + voice);
    if (!voice) {
      return;
    }

    let messageFromVoice = voice;
    console.log('visibleStep : ' + visibleStep);
    if (visibleStep === 4) {
        messageFromVoice = JSON.stringify({ 'feedback': voice, 'attempt': attempts });
    } 

    // const newMessage = { sender: "Human", message: messageFromVoice };
    // setConversation(prevConversation => [...prevConversation, newMessage]);
    setVoice('');

    try {
      // const message = extractPrompt([...conversation, newMessage]);
      console.log('sending prompt -> ' + messageFromVoice);
      const is_from_booth = new URLSearchParams(window.location.search).get('is_from_booth');
      const restOperation = post({
        apiName: 'chunliansApi',
        path: `/chunlian-master`,
        options: {
          headers: {'Content-Type': 'application/json'},
          body: {
            current_step: steps[visibleStep],
            prompt: messageFromVoice,
            is_from_booth: is_from_booth
          },
        },
      });
      if(visibleStep === 2){
        setStep(3);
      }
      const {body} = await restOperation.response;
      const data = await body.json();

      console.log(data.result);

      // fetch json out incase output is not just a json
      const leftBracketIndex = data.result.indexOf('{');
      const rightBracketIndex = data.result.lastIndexOf('}');
      console.log(
          data.result.substring(leftBracketIndex, rightBracketIndex + 1));

      const response = JSON.parse(
          data.result.substring(leftBracketIndex, rightBracketIndex + 1));
      // routing
      const next_step = response.next_step;
      console.log('next_step : ' + next_step);
      if (next_step === 'SET_THEME') {
        setStep(2);
      }
      if (next_step === 'CHUNLIAN_GEN') {
        setStep(3);
      }
      if (next_step === 'CHUNLIAN_REVIEW') {
        setAttempts(attempts + 1);
        setChunlians(response.chunlians);
        setStep(4);
      }
      if (next_step === 'PRINT') {
        setSelection(response.selection);
        setStep(5);
      }

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
      <Layout className={backgroundClassName}>
        <Header className="header" align="right">Marketing Tech荣誉出品</Header>
        <Content>
          {visibleStep === 1 && <CoupletMasterStep1/>}
          {visibleStep === 2 && <CoupletMasterStep2 theme={theme}/>}
          {visibleStep === 3 && <CoupletMasterStep3 theme={theme}/>}
          {visibleStep === 4 &&
              <CoupletMasterStep4 attempts={attempts} chunlians={chunlians} theme={theme}/>}
          {visibleStep === 5 &&
              <CoupletMasterStep5 attempts={attempts} chunlians={chunlians}
                                  selection={selection} theme={theme}/>}
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
                  <Input size="large" className="voiceInput" value={voice} 
                         ref={voiceInput} disabled={voiceInputDisabled[visibleStep]}
                         validateStatus={voiceInputDisabled[visibleStep] ? 'default' : 'warning'}
                         onChange={(value, e) => {
                           setVoice(value);
                           if (visibleStep === 2) {
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
