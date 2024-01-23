import React, {useEffect, useState} from 'react';
import {get, post} from '@aws-amplify/api';
import Cookies from 'js-cookie';
import Link from 'next/link';
import {v4 as uuidv4} from 'uuid';


const HomePage = () => {

  const [showForm, setShowForm] = useState(false); // State to toggle the form visibility

  const toggleForm = () => {
    setShowForm(!showForm); // Toggle the visibility of the form
  };

  return (
      <div>
        <h1>春联排行榜 Chunlian Ranking</h1>
        <Link href="/couplet_master">
          <button>和春联大师写新春联 Create A New Chunlian</button>
        </Link>
        <button onClick={toggleForm}>提交新春联 Submit New Chunlian</button>
        {showForm && <ChunlianForm onSubmit={toggleForm} />} {/* Show form when showForm is true */}
        <ChunlianList />
      </div>
  );
};

const ChunlianForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    topic: '',
    firstLine: '',
    secondLine: '',
    horizontalScroll: '',
    author: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call POST API here
    try {
      const requestBody = {
        ...formData,
        chunlianId: uuidv4().toString(),
        likesCount: 0,
        creationDate: new Date()
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
        <input name="topic" value={formData.topic} onChange={handleInputChange} placeholder="主题" />
        <input name="firstLine" value={formData.firstLine} onChange={handleInputChange} placeholder="上联" />
        <input name="secondLine" value={formData.secondLine} onChange={handleInputChange} placeholder="下联" />
        <input name="horizontalScroll" value={formData.horizontalScroll} onChange={handleInputChange} placeholder="横批" />
        <input name="author" value={formData.author} onChange={handleInputChange} placeholder="作者" />
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

export default HomePage;
