'use client';

import React, {useState, useEffect, useRef} from 'react';
import {
    Row,
    Col,
    Space,
    Card,
    Button,
    Descriptions,
    ButtonGroup, Layout, Typography,
} from '@douyinfe/semi-ui';
import {CoupletWidget} from './CoupletWidget';
import VoiceInput from '@/src/components/chatBotCouplet/VoiceInput';
import {useMediaQuery} from 'react-responsive';
import Header from '@douyinfe/semi-ui/lib/es/image/previewHeader';
import styles from "@/src/components/chatBotCouplet/VoiceInput.module.css";
import { isMobile } from 'react-device-detect';

export default function CoupletMasterStep4(props) {
    const [chunlians, setChunlians] = useState([]);
    const [chunlian1, setChunlian1] = useState(
        {hengpi: '', shanglian: '', xialian: ''});
    const [chunlian2, setChunlian2] = useState(
        {hengpi: '', shanglian: '', xialian: ''});
    const [chunlian3, setChunlian3] = useState(
        {hengpi: '', shanglian: '', xialian: ''});
    const voiceInputRef = useRef(null);

    const isOnMobile = useMediaQuery({maxWidth: 767}) || isMobile;
    console.log("isOnMobile", isOnMobile);

    const selectCouplet = (index) => {
        props.setSelection(index);
        props.setStep(5);
    };

    const {Header, Footer, Content} = Layout;

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

        if (voiceInputRef.current) {
            voiceInputRef.current.focus();
        }
    }, [props.chunlians]);

    const { Title } = Typography;

    if (isOnMobile) {
        return <>
            <Header className="step2Header"/>
            <Row type="flex" justify="center">
                <Col span={14} align="middle" className="hint" style={{marginBottom: '20px'}}>
                    <div className='hint' style={{color:'white'}} > 请选一幅保存 或点击"再来一次"</div>
                </Col>
                <Col span={18}>
                    <Space vertical>
                        <Card className="chunlianReviewCard"
                              headerLine={false}
                              // style={{
                              //     backgroundColor: 'rgba(255,243,195,0.66)'
                              // }}
                            >
                            <Descriptions
                                align="center"
                                size="small"
                                row
                                data={[
                                    {key: '上联', value: `${chunlian1.shanglian}`},
                                    {key: '下联', value: `${chunlian1.xialian}`},
                                    {key: '横批', value: `${chunlian1.hengpi}`},
                                ]}
                            />
                            <div style={{
                                margin: '12px 0',
                                display: 'flex',
                                justifyContent: 'center',
                            }}>
                                <Button theme='solid' type='warning' size='large'
                                        onClick={() => selectCouplet(0)}>选这幅 [传统风格]</Button>
                            </div>
                        </Card>
                        <Card
                            className="chunlianReviewCard"
                            headerLine={false}
                            // style={{
                            //     backgroundColor: 'rgba(255,243,195,0.66)'
                            // }}
                            >

                            <Descriptions
                                align="center"
                                size="small"
                                row
                                data={[
                                    {key: '上联', value: `${chunlian2.shanglian}`},
                                    {key: '下联', value: `${chunlian2.xialian}`},
                                    {key: '横批', value: `${chunlian2.hengpi}`},
                                ]}
                            />
                            <div style={{
                                margin: '12px 0',
                                display: 'flex',
                                justifyContent: 'center',
                            }}>
                                <Button theme='solid' type='warning' size='large'
                                        onClick={() => selectCouplet(1)}>选这幅 [古典风格]</Button>
                            </div>
                        </Card>
                        <Card
                            className="chunlianReviewCard"
                            headerLine={false}
                            // style={{
                            //     backgroundColor: 'rgba(255,243,195,0.66)'
                            // }}
                            >
                            <Descriptions
                                align="center"
                                size="small"
                                row
                                data={[
                                    {key: '上联', value: `${chunlian3.shanglian}`},
                                    {key: '下联', value: `${chunlian3.xialian}`},
                                    {key: '横批', value: `${chunlian3.hengpi}`},
                                ]}
                            />
                            <div style={{
                                margin: '12px 0',
                                display: 'flex',
                                justifyContent: 'center',
                            }}>
                                <Button theme='solid' type='warning' size='large'
                                        onClick={() => selectCouplet(2)}>选这幅 [搞笑风格]</Button>
                            </div>
                        </Card>
                    </Space>
                </Col>
            </Row>
            <Row type="flex" align="middle">
                <Col span={24} align="middle">
                    <Button type="warning" size="large" theme="solid"
                            onClick={() => window.location.reload()}
                            className={styles.submitButton2}>
                        再来一次
                    </Button>
                </Col>
            </Row>
        </>;
    } else {
        return <>
            <Header className="step2HeaderWeb"/>
            <Row type="flex" justify="center">
                <Col span={6}>
                    <CoupletWidget coupletTop={chunlian1.hengpi}
                                   coupletLeft={chunlian1.shanglian}
                                   coupletRight={chunlian1.xialian}
                                   font="OrdinaryFont"
                                   background="coupletReview"/>
                </Col>
                <Col span={6}>
                    <CoupletWidget coupletTop={chunlian2.hengpi}
                                   coupletLeft={chunlian2.shanglian}
                                   coupletRight={chunlian2.xialian}
                                   font="OrdinaryFont"
                                   background="coupletReview"/>
                </Col>
                <Col span={6}>
                    <CoupletWidget coupletTop={chunlian3.hengpi}
                                   coupletLeft={chunlian3.shanglian}
                                   coupletRight={chunlian3.xialian}
                                   font="OrdinaryFont"
                                   background="coupletReview"/>
                </Col>
            </Row>
            <Row type="flex" justify="center">
                <Col span={6}>
                    <div align="center" className="hint">传统风格</div>
                </Col>
                <Col span={6}>
                    <div align="center" className="hint">古典风格</div>
                </Col>
                <Col span={6}>
                    <div align="center" className="hint">搞笑风格</div>
                </Col>
            </Row>
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
            <Row type="flex" justify="center" align="middle">
                <Col span={10} align="center">
                    <VoiceInput
                        ref={voiceInputRef}
                        value={props.voice}
                        onValueChange={props.setVoice}
                        visible={true}
                        sendMessage={props.sendMessage}
                        buttonConfig={{
                            primaryButtonText: '提交',
                            secondaryButtonText: '再来一次',
                            secondaryButtonAction: () => window.location.reload(),
                        }}
                    />
                </Col>
            </Row>
        </>;
    }
};
