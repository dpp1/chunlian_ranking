import React, {useContext, useEffect, useState} from 'react';
import {get, post} from '@aws-amplify/api';
import Cookies from 'js-cookie';
import Link from 'next/link';
import {IconClock, IconLikeHeart} from '@douyinfe/semi-icons';
import GraphemeSplitter from 'grapheme-splitter';
import {
  Button, ButtonGroup,
  Card,
  Descriptions, Divider, Layout,
  Rating,
  Space, Spin,
  Form,
  Typography, RadioGroup, Radio, Row, Col,
} from '@douyinfe/semi-ui';
import GlobalContext from '@/src/globalContext';
// import { isMobile } from 'react-device-detect';

const {Meta} = Card;
const {Text} = Typography;

const HomePage = () => {
  const {Header, Footer, Content} = Layout;

  const getValueLength = (str) => {
    if (typeof str === 'string') {
      const splitter = new GraphemeSplitter();
      return splitter.countGraphemes(str);
    } else {
      return 0;
    }
  };

  return (
      <div className="gradient-background">
        <Layout className="chunlian-ranking-layout">
          <Header>
            <br/>
            <h1 align="center">春联大师</h1>
            <br/>
          </Header>
          <div style={{padding: '0 20px'}}>
            <Content>
              <div align="center" style={{width: '25%', margin: '0 auto'}}>
                <Link href="/couplet_master">
                  <Button block theme="solid" size="large">我也要写春联</Button>
                </Link>
              </div>
              <Divider margin="12px"/>
              <h3 align="center">春联排行榜</h3>
              <div>
                <Row gutter={{xs: 16, sm: 16, md: 16, lg: 24, xl: 24, xxl: 24}}>
                  <Col xs={0} sm={0} md={2} lg={3} xl={10} xxl={6}>
                    <div className="col-content"></div>
                  </Col>
                  <Col xs={24} sm={24} md={22} lg={21} xl={14} xxl={18}>
                    <div style={{width: '100%'}}>
                      <Form layout="horizontal"
                            style={{justifyContent:'center'}}
                          // style={{width: '800px'}}
                      >
                        <Form.Input noLabel
                                    field="username"
                                    minLength={1}
                                    maxLength={20}
                                    getValueLength={getValueLength}
                                    className="search-input"
                        />
                        <Button theme="solid"
                                htmlType="submit">搜索春联</Button>
                      </Form>
                    </div>
                  </Col>
                </Row>
                <br/>
                <Row>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                    <div className="col-content" align={'right'}>
                      <RadioGroup type="button"
                                  buttonSize="large"
                                  defaultValue={1}>
                        <Radio value={1}>最热</Radio>
                        <Radio value={2}>最新</Radio>
                      </RadioGroup>
                    </div>
                  </Col>
                </Row>

              </div>
              <br/>
              <br/>
              <br/>
              <ChunlianList/>
            </Content>
          </div>
          <Divider margin="12px"/>
          <Footer>
            <div align="center">
              <h4 align="center">MarTech 荣誉出品</h4>
            </div>
          </Footer>
        </Layout>
      </div>
  );
};
const ChunlianList = () => {
  const [chunlians, setChunlians] = useState([]);

  console.log(chunlians); // Check if chunlians are loaded

  useEffect(() => {
    fetchChunlians();
  }, []);

  const fetchChunlians = async () => {
    try {
      const restOperation = get({
        apiName: 'chunliansApi',
        path: '/chunlians',
      });
      const {body} = await restOperation.response;
      const response = await body.json();
      console.log('Fetched Chunlians', response);
      setChunlians(response);
    } catch (error) {
      console.error('Error fetching Chunlians', error);
    }
  };

  return (
      <div style={{
        display: 'flex',
        // justifyContent: 'center',
        // flexWrap: 'wrap',
      }}>
        <Space align='start' wrap spacing="medium" style={{justifyContent:'center'}}>
          {chunlians.length > 0 ? (
              chunlians.map(chunlian => (
                  <ChunlianItem key={chunlian.chunlianId} chunlian={chunlian}/>
              ))
          ) : (
              <div>
                <Spin size="large"/>
                <p>Loading Chunlians...</p>
              </div>
          )}
        </Space>
      </div>
  );
};

const ChunlianItem = ({chunlian}) => {
  const { userUUID, isFromBooth } = useContext(GlobalContext);
  const [likesCount, setLikesCount] = useState(chunlian.likesCount);
  const [userReaction, setUserReaction] = useState(0);

  useEffect(() => {
    // Check the user's previous reaction from local storage
    const userReactions = JSON.parse(localStorage.getItem('userReactions')) ||
        {};
    const reaction = userReactions[chunlian.chunlianId];
    // If the reaction is not found, default to 0 ('none')
    setUserReaction(typeof reaction === 'number' ? reaction : 0);
  }, [chunlian.chunlianId]);

  const handleReaction = (newReaction) => {
    let likesAdjustment = newReaction - userReaction;

    setLikesCount(likesCount + likesAdjustment);
    setUserReaction(newReaction);

    // Save the new reaction in local storage
    const userReactions = JSON.parse(localStorage.getItem('userReactions')) ||
        {};
    userReactions[chunlian.chunlianId] = newReaction;
    localStorage.setItem('userReactions', JSON.stringify(userReactions));

    const reactionData = {
      chunlianId: chunlian.chunlianId,
      userId: userUUID,
      reactionValue: newReaction,
    };

    try {
      post({
        apiName: 'chunliansApi',
        path: `/reactions`,
        options: {
          body: reactionData,
        },
      });
    } catch (e) {
      console.log('POST call failed: ', e);
    }
  };

  // Function to format the timestamp using the system/browser's default locale
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString(undefined, {
      // year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }) + ' ' + date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      // second: '2-digit'
    });
    return formattedDate;
  };

  return (
      <Card
          className={'chunlian-item'}
          title={
            <Meta
                title={`${chunlian.topic}`}
                description={
                  <div>
                    <br/>
                    <span>作者: {chunlian.author} </span>
                    <Divider layout="vertical" margin="12px"/>
                    <span>{formatTimestamp(
                        chunlian.creationDate)}</span>
                    <Divider layout="vertical" margin="12px"/>
                  </div>
                }
            />
          }
          shadows="always"
          headerExtraContent={
            <div>
              <Rating size={36}
                      character={(<IconLikeHeart
                          style={{
                            fontSize: 36, color: userReaction === 1
                                ? 'rgba(var(--semi-pink-5), 1)'
                                : 'rgba(var(--semi-grey-2), 1)',
                          }}
                      />)}
                      value={userReaction}
                      count={1}
                      onChange={() => handleReaction(
                          userReaction === 1 ? 0 : 1)}
              />
              <br/>
              <Text size={'small'}> {likesCount} 人已赞</Text>
            </div>
          }
      >
        <Descriptions
            align="center"
            size="small"
            row
            data={[
              {key: '上联', value: `${chunlian.firstLine}`},
              {key: '下联', value: `${chunlian.secondLine}`},
              {key: '横批', value: `${chunlian.horizontalScroll}`},
            ]}
        />
        <div style={{
          margin: '12px 0',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <ButtonGroup theme="borderless" style={{marginTop: 8}}>
            <Button>保存为图片</Button>
          </ButtonGroup>
        </div>
      </Card>
  );
};

export default HomePage;
