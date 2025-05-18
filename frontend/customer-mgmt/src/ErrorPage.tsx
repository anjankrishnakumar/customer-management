import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { message?: string };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Something went wrong 😞</h1>
      <p style={styles.message}>{state?.message || 'An unexpected error occurred.'}</p>
      <button style={styles.button} onClick={() => navigate('/')}>Go Back</button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center' as const,
    marginTop: '100px',
  },
  heading: {
    fontSize: '32px',
    color: '#dc2626',
  },
  message: {
    marginTop: '20px',
    fontSize: '18px',
  },
  button: {
    marginTop: '30px',
    padding: '10px 20px',
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default ErrorPage;
