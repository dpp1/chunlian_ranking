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
import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  Layout,
  Row,
  Col,
  Input,
} from '@douyinfe/semi-ui';
import {post} from '@aws-amplify/api';
import GlobalContext from '@/src/globalContext';
import { isMobile } from 'react-device-detect';


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

  const [theme, setTheme] = useState('');
  const [attempts, setAttempts] = useState(1);
  const [selection, setSelection] = useState();
  const [chunlians, setChunlians] = useState([]);

  const {Header, Footer, Content, Sider} = Layout;
  const { userUUID, isFromBooth } = useContext(GlobalContext);
  console.log("isMobile: ", isMobile);

  useEffect(() => {
    setBackground('background' + visibleStep);
  }, [visibleStep]);

  useEffect(() => {
    if (voice && isFromBooth) {
      const timeoutId = setTimeout(() => {
        sendMessage(voice);
      }, '3000');
      return () => clearTimeout(timeoutId);
    }
  }, [voice, isFromBooth]);

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
      const restOperation = post({
        apiName: 'chunliansApi',
        path: `/chunlian-master`,
        options: {
          headers: {'Content-Type': 'application/json'},
          body: {
            current_step: steps[visibleStep],
            prompt: userPrompt,
            is_from_booth: isFromBooth,
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
          if (attempts >= 3 && isFromBooth) {
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
          {visibleStep === 2 && <CoupletMasterStep2 theme={theme} voice={voice} setVoice={setVoice} setTheme={setTheme} sendMessage={sendMessage}/>}
          {visibleStep === 3 && <CoupletMasterStep3 theme={theme}/>}
          {visibleStep === 4 &&
              <CoupletMasterStep4 attempts={attempts} chunlians={chunlians}
                                  theme={theme} voice={voice} setVoice={setVoice} sendMessage={sendMessage}
                                  setSelection={setSelection} setStep={setStep}
              />}
          {visibleStep === 5 &&
              <CoupletMasterStep5 attempts={attempts} chunlians={chunlians}
                                  selection={selection} theme={theme}/>}
        </Content>
        <Footer>
          <Layout>
            <Content>
              <Row type="flex" gutter={8}>
                <Col align="middle" span={24} className="hint">Marketing Tech荣誉出品</Col>
              </Row>
              <br/>
              <br/>
              <br/>
            </Content>
          </Layout>
        </Footer>
      </Layout>
  );
}
