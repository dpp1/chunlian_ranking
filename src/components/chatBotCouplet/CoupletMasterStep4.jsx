'use client';

import React, {useState, useEffect, useRef} from 'react';
import {Row, Col, Space} from '@douyinfe/semi-ui';
import {CoupletWidget} from './CoupletWidget';
import VoiceInput from '@/src/components/chatBotCouplet/VoiceInput';

export default function CoupletMasterStep4(props) {
  const [chunlians, setChunlians] = useState([]);
  const [chunlian1, setChunlian1] = useState(
      {hengpi: '', shanglian: '', xialian: ''});
  const [chunlian2, setChunlian2] = useState(
      {hengpi: '', shanglian: '', xialian: ''});
  const [chunlian3, setChunlian3] = useState(
      {hengpi: '', shanglian: '', xialian: ''});
  const voiceInputRef = useRef(null);

  useEffect(() => {
    // setAttempts(props.attempts);
    setChunlians(props.chunlians);
    // console.log(props.attempts);
    console.log(props.chunlians);
    setChunlian1(props.chunlians[0]);
    setChunlian2(props.chunlians[1]);
    setChunlian3(props.chunlians[2]);

    // setChunlian1({ hengpi: "奋勇拼搏", shanglian: "发愤图强兴大业", xialian: "勤劳致富建小康" });
    // setChunlian2({ hengpi: "勇往直前", shanglian: "长风破浪会有时", xialian: "直挂云帆济沧海" });
    // setChunlian3({ hengpi: "中国福彩", shanglian: "早中晚中早晚中", xialian: "多买少买多少买" });

  }, [props]);

  return <>
    <Row type="flex" justify="center">
      <Col span={6}>
        <CoupletWidget coupletTop={chunlian1.hengpi}
                       coupletLeft={chunlian1.shanglian}
                       coupletRight={chunlian1.xialian} font="OrdinaryFont"
                       background="coupletReview"/>
        <div align="center" className="hint">传统风格</div>
      </Col>
      <Col span={6}>
        <CoupletWidget coupletTop={chunlian2.hengpi}
                       coupletLeft={chunlian2.shanglian}
                       coupletRight={chunlian2.xialian} font="OrdinaryFont"
                       background="coupletReview"/>
        <div align="center" className="hint">古典风格</div>
      </Col>
      <Col span={6}>
        <CoupletWidget coupletTop={chunlian3.hengpi}
                       coupletLeft={chunlian3.shanglian}
                       coupletRight={chunlian3.xialian} font="OrdinaryFont"
                       background="coupletReview"/>
        <div align="center" className="hint">搞笑风格</div>
      </Col>
    </Row>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <Row type="flex" justify="center" align="middle">
      <Col span={14} align="middle" className="hint">
        选一幅对联打印，如“打印第二幅”。也可以说“再来一次”
      </Col>
    </Row>
    <br/>
    <br/>
    <Row type="flex" justify="center" align="middle">
      <Col span={10} align="center">
        <VoiceInput
            ref={voiceInputRef}
            value={props.voice}
            onValueChange={props.setVoice}
            visible={true}
        />
      </Col>
    </Row>
  </>;
}
