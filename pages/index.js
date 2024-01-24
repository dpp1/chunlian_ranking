import React, {useEffect, useState} from 'react';
import {get, post} from '@aws-amplify/api';
import Cookies from 'js-cookie';
import Link from 'next/link';
import {v4 as uuidv4} from 'uuid';
import {IconLikeHeart} from '@douyinfe/semi-icons';
import {
  Button,
  Card,
  Col,
  Rating,
  Row,
  Space,
  Typography,
} from '@douyinfe/semi-ui';

const HomePage = () => {

  const [showForm, setShowForm] = useState(false); // State to toggle the form visibility

  const toggleForm = () => {
    setShowForm(!showForm); // Toggle the visibility of the form
  };

  return (
      <div className="grid">
        <h1 align="center">春联排行榜</h1>
        <hr />
        <Row>
          <Col span={24} offset={11}>
            <Link href="/couplet_master">
              <Button theme="solid">我也要写春联</Button>
            </Link>
          </Col>
        </Row>
        <br/>
        {/*<button onClick={toggleForm}>提交新春联 Submit New Chunlian</button>*/}
        {/*{showForm && <ChunlianForm onSubmit={toggleForm} />} /!* Show form when showForm is true *!/*/}
        <Row>
          <Col span={24} offset={8}>
            <ChunlianList/>
          </Col>
        </Row>

      </div>
  );
};

const ChunlianForm = ({onSubmit}) => {
  const [formData, setFormData] = useState({
    topic: '',
    firstLine: '',
    secondLine: '',
    horizontalScroll: '',
    author: '',
  });

  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call POST API here
    try {
      const requestBody = {
        ...formData,
        chunlianId: uuidv4().toString(),
        likesCount: 0,
        creationDate: Date.now(),
      };
      console.log('New Chunlian Request: ', requestBody);
      await post({
        apiName: 'chunliansApi',
        path: '/chunlians',
        options: {
          body: requestBody,
        },
      });
      alert('Chunlian submitted successfully');
      onSubmit(); // Hide form after submission
    } catch (error) {
      console.error('Error submitting Chunlian', error);
      alert('Failed to submit Chunlian');
    }
  };

  return (
      <form onSubmit={handleSubmit}>
        <input name="topic" value={formData.topic} onChange={handleInputChange}
               placeholder="主题"/>
        <input name="firstLine" value={formData.firstLine}
               onChange={handleInputChange} placeholder="上联"/>
        <input name="secondLine" value={formData.secondLine}
               onChange={handleInputChange} placeholder="下联"/>
        <input name="horizontalScroll" value={formData.horizontalScroll}
               onChange={handleInputChange} placeholder="横批"/>
        <input name="author" value={formData.author}
               onChange={handleInputChange} placeholder="作者"/>
        <button type="submit">Submit</button>
      </form>
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
      <div>
        <Space vertical spacing='medium'>
          {chunlians.length > 0 ? (
              chunlians.map(chunlian => (
                  <ChunlianItem key={chunlian.chunlianId} chunlian={chunlian}/>
              ))
          ) : (
              <p>Loading Chunlians...</p> // Fallback text
          )}
        </Space>
      </div>
  );
};

const ChunlianItem = ({chunlian}) => {
  const [likesCount, setLikesCount] = useState(chunlian.likesCount);
  const [userReaction, setUserReaction] = useState(0); // Changed to integer, 0 for 'none'

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

    const userUUID = Cookies.get('userUUID');
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

  const {Meta} = Card;
  const {Text} = Typography;
  return (
      <Card
          title={
            <Meta
                title={`心愿: ${chunlian.topic}`}
                description={`作者: ${chunlian.author} | 创作于: ${formatTimestamp(
                    chunlian.creationDate)} | ${likesCount} 个人赞了`}
            />
          }
          style={{width: 480, maxWidth: 960}}
          shadows="always"
          headerExtraContent={
            <div>

              <Rating style={{color: 'red'}} size={36}
                      character={(<IconLikeHeart style={{fontSize: 36}}/>)}
                      value={userReaction}
                      count={1}
                      onChange={() => handleReaction(
                          userReaction === 1 ? 0 : 1)}
              />
            </div>
          }

      >

        <p><Text>上联: {chunlian.firstLine}</Text></p>
        <p><Text>下联: {chunlian.secondLine}</Text></p>
        <p><Text>横批: {chunlian.horizontalScroll}</Text></p>
      </Card>
  )
      ;
};

export default HomePage;
