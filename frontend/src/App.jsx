// nexus-erp-frontend/src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';

// IMPORTANT: This is where we define the address of our Java Backend!
const API_URL = 'http://localhost:8080/api/status';

function App() {
  const [backendStatus, setBackendStatus] = useState('Not Connected');
  
  const checkConnection = async () => {
    try {
      // Sends a GET request to the Java backend
      const response = await axios.get(API_URL);
      setBackendStatus(response.data); // Expecting text/string response
    } catch (error) {
      console.error("Error connecting to Java backend:", error);
      setBackendStatus('Connection Error! Is the Java server running on port 8080?');
    }
  };

  return (
    <div>
      <h1>Nexus ERP Frontend</h1>
      <p>Backend Status: <strong>{backendStatus}</strong></p>
      <button onClick={checkConnection}>Test Connection to Java Server</button>
    </div>
  );
}

export default App;