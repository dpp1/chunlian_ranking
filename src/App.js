import React, {useEffect, useState} from 'react';
import './App.css';
import { get, post } from '@aws-amplify/api';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

const ensureUserUUID = () => {
  if (!Cookies.get('userUUID')) {
    Cookies.set('userUUID', uuidv4());
  }
};

const App = () => {
  useEffect(() => {
    ensureUserUUID();
  }, []);

  return (
      <div className="App">
        <h1>春联排行榜 Chunlian Ranking</h1>
        <ChunlianList />
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
        path:'/chunlians'
      });
      const { body } = await restOperation.response;
      const response = await body.json();
      console.log("Fetched Chunlians", response);
      setChunlians(response);
    } catch (error) {
      console.error("Error fetching Chunlians", error);
    }
  };

  return (
      <div>
        {chunlians.length > 0 ? (
            chunlians.map(chunlian => (
                <ChunlianItem key={chunlian.chunlianId} chunlian={chunlian} />
            ))
        ) : (
            <p>No Chunlians found.</p> // Fallback text
        )}
      </div>
  );
};

const ChunlianItem = ({ chunlian }) => {
  const [likesCount, setLikesCount] = useState(chunlian.likesCount);
  const [userReaction, setUserReaction] = useState(0); // Changed to integer, 0 for 'none'

  useEffect(() => {
    // Check the user's previous reaction from local storage
    const userReactions = JSON.parse(localStorage.getItem('userReactions')) || {};
    const reaction = userReactions[chunlian.chunlianId];
    // If the reaction is not found, default to 0 ('none')
    setUserReaction(typeof reaction === 'number' ? reaction : 0);
  }, [chunlian.chunlianId]);


  const handleReaction = (newReaction) => {
    let likesAdjustment = newReaction - userReaction;

    setLikesCount(likesCount + likesAdjustment);
    setUserReaction(newReaction);

    // Save the new reaction in local storage
    const userReactions = JSON.parse(localStorage.getItem('userReactions')) || {};
    userReactions[chunlian.chunlianId] = newReaction;
    localStorage.setItem('userReactions', JSON.stringify(userReactions));


    const userUUID = Cookies.get('userUUID');
    const reactionData = {
      chunlianId: chunlian.chunlianId,
      userId: userUUID,
      reactionValue: newReaction
    };

    try {
      post({
        apiName: 'chunliansApi',
        path: `/reactions`,
        options: {
          body: reactionData
        }
      });
    } catch (e) {
      console.log('POST call failed: ', e);
    }
  };

  // Function to format the timestamp using the system/browser's default locale
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }) + ' ' + date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    return formattedDate;
  };

  return (
      <div className="chunlian-item">
        <h2>{chunlian.topic}</h2>
        <p>上联: {chunlian.firstLine}</p>
        <p>下联: {chunlian.secondLine}</p>
        <p>横批: {chunlian.horizontalScroll}</p>
        <p>{likesCount} likes</p>
        <button
            onClick={() => handleReaction(userReaction === 1 ? 0 : 1)}
            style={{ backgroundColor: userReaction === 1 ? 'blue' : 'grey' }}
        >
          👍
        </button>
        <button
            onClick={() => handleReaction(userReaction === -1 ? 0 : -1)}
            style={{ backgroundColor: userReaction === -1 ? 'red' : 'grey' }}
        >
          👎
        </button>
        <p>创作时间: {formatTimestamp(chunlian.creationDate)}</p>
        <p>作者: {chunlian.author}</p>
      </div>
  );
};

export default App;
