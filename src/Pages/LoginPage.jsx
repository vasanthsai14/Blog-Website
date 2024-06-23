import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  async function login(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        setError("Wrong Credentials");
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        const { id, username } = await response.json();
        setUserInfo({ id, username });

        // You might want to store the token in localStorage if needed
        // const token = response.headers.get('Authorization');
        // localStorage.setItem('token', token);

        navigate('/');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      setError('Error during login. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="login" onSubmit={login}>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <h1>Login</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Login</button>
    </form>
  );
}
