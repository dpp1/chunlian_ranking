import React, {useContext, useEffect, useRef, useState} from 'react';
import {get, post} from '@aws-amplify/api';
import Link from 'next/link';
import {IconLikeHeart} from '@douyinfe/semi-icons';
import GraphemeSplitter from 'grapheme-splitter';
import {
    Button,
    ButtonGroup,
    Card,
    Col,
    Descriptions,
    Divider,
    Form,
    Layout,
    Radio,
    RadioGroup,
    Rating,
    Row,
    Space,
    Spin,
    Typography,
} from '@douyinfe/semi-ui';
import GlobalContext from '@/src/globalContext';
import {useRouter} from "next/router";
// import { isMobile } from 'react-device-detect';

const {Meta} = Card;
const {Text} = Typography;

const HomePage = () => {
    const router = useRouter();
    const [orderBy, setOrderBy] = useState('hot'); // Set initial value based on URL parameter
    const [searchText, setSearchText] = useState('');
    const [triggerRefresh, setTriggerRefresh] = useState(false);
    const [author, setAuthor] = useState('');

    const refreshList = () => {
        setTriggerRefresh(true);
    };

    const {Header, Footer, Content} = Layout;

    const getValueLength = (str) => {
        if (typeof str === 'string') {
            const splitter = new GraphemeSplitter();
            return splitter.countGraphemes(str);
        } else {
            return 0;
        }
    };

    const handleReset = () => {
        if (searchText !== '') {
            setSearchText('');
            refreshList();
        }
    };
    const handleSubmit = (value) => {
        if (value.searchText !== undefined && value.searchText.trim() !== '') {
            // Get value from form input
            setSearchText(value.searchText.trim());
            console.log('Search Text: ', searchText);
            refreshList();
        }
    };

    const formRef = useRef();

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
                        <div align="center" style={{width: '40%', margin: '0 auto'}}>
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
                                        <Form ref={formRef}
                                              layout="horizontal"
                                              style={{justifyContent: 'center'}}
                                              onSubmit={handleSubmit}
                                            // style={{width: '800px'}}
                                        >
                                            <Form.Input noLabel
                                                        field="searchText"
                                                        minLength={1}
                                                        maxLength={20}
                                                        className="search-input"
                                                        placeholder='搜作者 主题或春联内容'
                                            />
                                            <Button theme="solid"
                                                    htmlType="submit">搜索</Button>
                                            <Button onClick={handleReset} htmlType="reset"
                                                    style={{marginLeft: '5px'}}>重置</Button>
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
                                                    value={orderBy}
                                                    onChange={(e) => {
                                                        setOrderBy(e.target.value);
                                                        refreshList();
                                                    }}
                                                    defaultValue={1}>
                                            <Radio value={'hot'}>最热</Radio>
                                            <Radio value={'new'}>最新</Radio>
                                        </RadioGroup>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <ChunlianList orderBy={orderBy} setOrderBy={setOrderBy} searchText={searchText} triggerRefresh={triggerRefresh} router={router}/>
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
const ChunlianList = ({orderBy, setOrderBy, searchText, triggerRefresh, router}) => {
    const [chunlians, setChunlians] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [allItemsLoaded, setAllItemsLoaded] = useState(false); // New state

    console.log(chunlians); // Check if chunlians are loaded

    useEffect(() => {
        if (router.isReady) {
            const queryOrderBy = router.query.orderBy;
            if (queryOrderBy && (queryOrderBy === 'hot' || queryOrderBy === 'new')) {
                setOrderBy(queryOrderBy);
            }
            fetchChunlians(1, queryOrderBy);
        }
    }, [router.isReady, router.query.orderBy]);

    console.log("orderBy", orderBy);


    useEffect(() => {
        if (triggerRefresh) {
            setChunlians([]);
            setPage(1);
            fetchChunlians(1, orderBy);
        }
    }, [orderBy, searchText, triggerRefresh]);

    const fetchChunlians = async (pageNumber, localOrderBy) => {
        if (isLoading || (allItemsLoaded && pageNumber !== 1)) return; // Prevent fetching if already loading
        setIsLoading(true);
        try {
            const input = {
                apiName: 'chunliansApi',
                path: `/chunlians?page=${pageNumber}&orderBy=${localOrderBy}&searchText=${searchText}`,
            };
            console.log('query params:', input.path);
            const restOperation = get(input);
            const {body} = await restOperation.response;
            const response = await body.json();
            console.log('Fetched Chunlians', response);
            // Update chunlians with items and set total
            if (response.items && Array.isArray(response.items)) {
                setChunlians(prevChunlians => pageNumber === 1 ? response.items : [...prevChunlians, ...response.items]);
                setTotal(response.total); // Update total count
                // Check if all items have been loaded
                if (chunlians.length >= response.total) {
                    setAllItemsLoaded(true);
                }
            } else {
                console.error('Invalid response format:', response);
            }
        } catch (error) {
            console.error('Error fetching Chunlians', error);
        } finally {
            setIsLoading(false); // Reset loading state when request is complete
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
            setPage(prevPage => prevPage + 1);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, allItemsLoaded]);

    useEffect(() => {
        if (page > 1) {
            fetchChunlians(page, orderBy);
        }
    }, [page]);

    return (
        <div>
            <p>{`共${total}条春联`}</p>
            <div style={{
                display: 'flex',
                // justifyContent: 'center',
                // flexWrap: 'wrap',
            }}>
                <Space align='start' wrap spacing="medium" style={{justifyContent: 'center'}}>
                    {chunlians.map(chunlian => (
                        <ChunlianItem key={chunlian.chunlianId} chunlian={chunlian}/>
                    ))}

                    {isLoading && (
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <Spin size="large"/>
                            <p>读取中...</p>
                        </div>
                    )}

                    {!isLoading && chunlians.length === 0 && (
                        <p>未找到春联</p> // Message when there are no results
                    )}
                </Space>
            </div>
        </div>
    );
};

const ChunlianItem = ({chunlian}) => {
    const {userUUID, isFromBooth} = useContext(GlobalContext);
    const [likesCount, setLikesCount] = useState(chunlian.likesCount);
    const [userReaction, setUserReaction] = useState(0);
    const { Text, Title } = Typography;

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
                    title={<Title heading={5} ellipsis={{ showTooltip: true }} style={{maxWidth: '200px'}}>{chunlian.topic}</Title>}
                    description={
                        <div>
                            <br/>
                            <span><Text ellipsis={{ showTooltip: true }}>作者: {chunlian.author} </Text></span>
                            <Divider layout="vertical" margin="12px"/>
                            <span>{formatTimestamp(
                                chunlian.creationDate)}</span>
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
            {/*<div style={{*/}
            {/*    margin: '12px 0',*/}
            {/*    display: 'flex',*/}
            {/*    justifyContent: 'flex-end',*/}
            {/*}}>*/}
            {/*    <ButtonGroup theme="borderless" style={{marginTop: 8}}>*/}
            {/*        <Button>保存为图片</Button>*/}
            {/*    </ButtonGroup>*/}
            {/*</div>*/}
        </Card>
    );
};

export default HomePage;
