// src/components/Loading.jsx
import React from 'react';
import '../styles/Loading.css';

const Loading = ({ message = "Carregando..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default Loading;