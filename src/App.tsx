import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import ImageMerger from './components/ImageMerger';
import ImageSplitter from './components/ImageSplitter';

import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Header />
        <div className="content">
          <Routes>
            <Route path="/merge" element={<ImageMerger />} />
            <Route path="/split" element={<ImageSplitter />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
