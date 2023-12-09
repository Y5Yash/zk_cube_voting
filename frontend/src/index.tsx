import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AnonAadhaarProvider } from "anon-aadhaar-react";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const app_id = BigInt("0")

root.render(
  <React.StrictMode>
    <AnonAadhaarProvider _appId={app_id.toString()}>
      <App />
    </AnonAadhaarProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
