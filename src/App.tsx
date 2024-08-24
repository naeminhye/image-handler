import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import ImageMerger from './components/ImageMerger';
import ImageSplitter from './components/ImageSplitter';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <nav className="menu">
          <ul className="menu-list">
            <li>
              <Link to="/merger">Image Merger</Link>
            </li>
            <li>
              <Link to="/splitter">Image Splitter</Link>
            </li>
          </ul>
        </nav>
        <div className="content">
          <Routes>
            <Route path="/splitter" element={<ImageSplitter />} />
            <Route path="/*" element={<ImageMerger />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
