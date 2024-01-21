import React, { useState } from 'react';
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
    creationDate: "2024-01-20T15:45:30.123Z",
    author: "Li Hua",
    likes: 15
  },
  {
    id: 2,
    topic: "Harvest Joy",
    firstLine: "五谷丰登",
    secondLine: "秋收喜悦",
    horizontalScroll: "丰收年",
    creationDate: "2024-01-18T09:20:10.456Z",
    author: "Wang Wei",
    likes: 8
  },
  // Add more Chunlian objects as needed
];

const ChunlianList = () => {
  const [chunlians, setChunlians] = useState(placeholderChunlians);

  return (
      <div>
        {chunlians.map(chunlian => (
            <ChunlianItem key={chunlian.id} chunlian={chunlian} />
        ))}
      </div>
  );
};

const ChunlianItem = ({ chunlian }) => {
  // ... rest of the ChunlianItem component
};

export default App;
