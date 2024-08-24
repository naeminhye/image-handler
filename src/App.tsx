import React from 'react';
import ImageMerger from './components/ImageMerger';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Image Merger</h1>
      <ImageMerger />
    </div>
  );
};

export default App;
