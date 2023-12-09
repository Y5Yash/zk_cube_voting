import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  AnonAadhaarProof,
  LogInWithAnonAadhaar,
  useAnonAadhaar,
} from "anon-aadhaar-react";

function App() {
  const [anonAadhaar] = useAnonAadhaar();

  useEffect(() => {
    console.log("Anon Aadhaar status: ", anonAadhaar.status);
  }, [anonAadhaar]);

  return (
    <div className="App">
      <LogInWithAnonAadhaar/>
      <p>{anonAadhaar?.status}</p>
    </div>
  );
}

export default App;
