import React, { useState, useRef, useEffect, useCallback } from 'react';
import HomePage from './pages/homePage';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="container">
      <HomePage />
    </div>
  );
}

export default App;
