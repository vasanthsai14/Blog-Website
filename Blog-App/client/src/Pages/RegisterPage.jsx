import { useState } from "react";
export default function RegisterPage(){
    const[username,setUsername]=useState('');
    const[password,setPassword]=useState('');
    async function register(e) {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            // Handling successful response
            const data = await response.json();
            alert("Registration successful");
            console.log('Registration successful:', data);
    
        } catch (error) {
            alert('Error during registration:', error.message);
        }
    }
    
    return (
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
        <input type="text" placeholder="username" 
               value={username} 
               onChange={e=>setUsername(e.target.value)} />
        <input type="password" placeholder="password" 
               value={password} 
               onChange={e=>setPassword(e.target.value)}/>
        <button> Register </button>
       </form>
    );
}