import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';  // Tuodaan App-komponentti
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />  {/* Renderöidään App-komponentti */}
  </React.StrictMode>,
  document.getElementById('root')  // Renderöidään App-komponentti "root"-elementtiin HTML:ssä
);

reportWebVitals();
