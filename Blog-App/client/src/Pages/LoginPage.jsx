import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";


export default function LoginPage() {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const{setUserInfo}= useContext(UserContext);
  const navigate = useNavigate();
  async function login(e){
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
  
        if (!response.ok) {
            alert("Wrong Credentials");
          throw new Error(`HTTP error! Status: ${response.status}`);
        }  
        else{
          response.json().then(userDoc=>{
            setUserInfo(userDoc);
            setRedirect(true);
          })
            alert('Login Successful!');
        }        
      } catch (error) {
        console.log('Error during login:', error.message);
      }
}
if (redirect){
  navigate("/");
}
  return (
    <form className="login" onSubmit={login}>
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
      <button> Login </button>
    </form>
  );
}
