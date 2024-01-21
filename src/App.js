import React, {useEffect, useState} from 'react';
import './App.css';

const App = () => {
  return (
      <div className="App">
        <h1>Chunlian Ranking</h1>
        <ChunlianList />
      </div>
  );
};

// Placeholder data with ISO 8601 timestamps
const placeholderChunlians = [
  {
    id: 1,
    topic: "Spring Blossoms",
    firstLine: "花开富贵",
    secondLine: "春满人间",
    horizontalScroll: "春暖花开",
    creationDate: 1705825001000,
    author: "Li Hua",
    likes: 15
  },
  {
    id: 2,
    topic: "Harvest Joy",
    firstLine: "五谷丰登",
    secondLine: "秋收喜悦",
    horizontalScroll: "丰收年",
    creationDate: 1705825014000,
    author: "Wang Wei",
    likes: 8
  },
  // Add more Chunlian objects as needed
];

const ChunlianList = () => {
  const [chunlians, setChunlians] = useState(placeholderChunlians);

  console.log(chunlians); // Check if chunlians are loaded

  return (
      <div>
        {chunlians.length > 0 ? (
            chunlians.map(chunlian => (
                <ChunlianItem key={chunlian.id} chunlian={chunlian} />
            ))
        ) : (
            <p>No Chunlians found.</p> // Fallback text
        )}
      </div>
  );
};

const ChunlianItem = ({ chunlian }) => {
  const [likes, setLikes] = useState(chunlian.likes);
  const [userReaction, setUserReaction] = useState('none'); // 'liked', 'disliked', 'none'

  useEffect(() => {
    // Check the user's previous reaction from local storage
    const userReactions = JSON.parse(localStorage.getItem('userReactions')) || {};
    const reaction = userReactions[chunlian.id] || 'none';
    setUserReaction(reaction);
  }, [chunlian.id]);

  const handleReaction = (newReaction) => {
    let likesAdjustment = 0;
    if (newReaction === 'liked' && userReaction !== 'liked') {
      likesAdjustment = userReaction === 'disliked' ? 2 : 1;
    } else if (newReaction === 'disliked' && userReaction !== 'disliked') {
      likesAdjustment = userReaction === 'liked' ? -2 : -1;
    } else if (newReaction === 'none') {
      likesAdjustment = userReaction === 'liked' ? -1 : 1;
    }

    setLikes(likes + likesAdjustment);
    setUserReaction(newReaction);

    // Save the new reaction in local storage
    const userReactions = JSON.parse(localStorage.getItem('userReactions')) || {};
    userReactions[chunlian.id] = newReaction;
    localStorage.setItem('userReactions', JSON.stringify(userReactions));

    // TODO: Make an API call to update the server (optional)
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
        <p>{likes} likes</p>
        <button
            onClick={() => handleReaction(userReaction === 'liked' ? 'none' : 'liked')}
            style={{ backgroundColor: userReaction === 'liked' ? 'blue' : 'grey' }}
        >
          👍
        </button>
        <button
            onClick={() => handleReaction(userReaction === 'disliked' ? 'none' : 'disliked')}
            style={{ backgroundColor: userReaction === 'disliked' ? 'red' : 'grey' }}
        >
          👎
        </button>
        <p>创作时间: {formatTimestamp(chunlian.creationDate)}</p>
        <p>作者: {chunlian.author}</p>
      </div>
  );
};

export default App;
