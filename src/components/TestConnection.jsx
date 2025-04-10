import { useState, useEffect } from 'react';
import axios from 'axios';

const TestConnection = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/test');
        setMessage(response.data.message);
      } catch (err) {
        setError('Error connecting to the backend');
        console.error('Error:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {message && <p>Message from backend: {message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default TestConnection; 