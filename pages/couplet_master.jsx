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

  const steps = [
    '',
    '',
    'SET_THEME',
    'CHUNLIAN_GEN',
    'CHUNLIAN_REVIEW',
    'PRINT'];

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

    let userPrompt = voice;
    console.log('current step : ' + visibleStep);

    // const newMessage = { sender: "Human", message: messageFromVoice };
    // setConversation(prevConversation => [...prevConversation, newMessage]);
    setVoice('');

    try {
      // const message = extractPrompt([...conversation, newMessage]);
      console.log('sending prompt -> ' + userPrompt);
      const is_from_booth = new URLSearchParams(window.location.search)
          .get('is_from_booth') === 'true';
      const restOperation = post({
        apiName: 'chunliansApi',
        path: `/chunlian-master`,
        options: {
          headers: {'Content-Type': 'application/json'},
          body: {
            current_step: steps[visibleStep],
            prompt: userPrompt,
            is_from_booth: is_from_booth,
          },
        },
      });
      if (visibleStep === 2) {
        console.log('Setting step to 3');
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
      const llm_suggested_next_step = response.next_step;
      console.log('LLM suggested next_step : ' + llm_suggested_next_step);
      if ((visibleStep === 2 || visibleStep === 3) &&
          llm_suggested_next_step === 'CHUNLIAN_REVIEW') {
        // Move from Set Theme page or Chunlian Loading Page to Chunlian Review Page
        setChunlians(response.chunlians);
        console.log('Setting step to 4');
        setStep(4);
      } else if (visibleStep === 4
          && (llm_suggested_next_step === 'SET_THEME' ||
              llm_suggested_next_step === 'PRINT')) {
        // If at Chunlian Review Page
        if (llm_suggested_next_step === 'SET_THEME') {
          // User wants another try, check the number of attempts
          if (attempts >= 3 && is_from_booth) {
            //TODO: Handle the attempt limit reached case.
            // Current Workaround, select the first and move on
            setSelection(0);
            setStep(5);
          } else {
            // Attempts < 3 or not from booth, allow retry.
            setAttempts(attempts + 1);
            console.log('Retrying game with attempt #', attempts);
            console.log('Setting step to 2');
            setStep(2);
          }
        } else {
          // From Chunlian Review Page to Print Page
          setSelection(response.selection);
          console.log('Setting step to 5');
          setStep(5);
        }
      } else {
        console.error('Unexpected state. visibleStep: ', visibleStep,
            ' llm_suggested_next_step: ', llm_suggested_next_step);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
      <Layout className={backgroundClassName}>
        <Content>
          {visibleStep === 1 && <CoupletMasterStep1/>}
          {visibleStep === 2 && <CoupletMasterStep2 theme={theme}/>}
          {visibleStep === 3 && <CoupletMasterStep3 theme={theme}/>}
          {visibleStep === 4 &&
              <CoupletMasterStep4 attempts={attempts} chunlians={chunlians}
                                  theme={theme}/>}
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
              <Row type="flex" gutter={8}>
                <Col align="right" span={1} offset={5}>
                  <div className="audioIcon"/>
                </Col>
                <Col align="middle" span={12}>
                  <Input size="large" className="voiceInput" value={voice}
                         ref={voiceInput}
                         disabled={voiceInputDisabled[visibleStep]}
                         validateStatus={voiceInputDisabled[visibleStep]
                             ? 'default'
                             : 'warning'}
                         onChange={(value, e) => {
                           setVoice(value);
                           if (visibleStep === 2) {
                             setTheme(value);
                           }
                         }}
                  ></Input>
                </Col>
                <Col  span={6} >
                    <div className="header" align="right">Marketing Tech荣誉出品</div>
                </Col>
              </Row>
              <br/>
            </Content>
          </Layout>
        </Footer>
      </Layout>
  );
}
