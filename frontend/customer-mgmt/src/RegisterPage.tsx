import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Reuse the same CSS

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
    const style = { marginBottom: '20px' };
    const style1 = { marginRight: '20px' };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      setSuccess(true);
      alert('Registration successful! You can now log in.');
      console.log(success)
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div >
        <h1>Customer Management</h1>
    <div className="login-container">
        
      <form className="login-form" onSubmit={handleRegister}>
        <h2 className="login-title">Register</h2>

        <div className="form-group" style={style}>
          <label style={style1}>Username</label>
          <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Choose a username"
            
          />
        </div>

        <div className="form-group" style={style}>
          <label style={style1}>Password</label>
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Create a password"
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="login-button" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="redirect-text">
          Already have an account?{' '}
          <span className="link-button" onClick={() => navigate('/login')}>
            Login
          </span>
        </p>
      </form>
    </div>
    </div>
  );
};

export default RegisterPage;
