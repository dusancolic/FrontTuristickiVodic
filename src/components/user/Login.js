import React, { useState } from 'react';
import axios from 'axios';
import '../Form.css';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/users/login', {
                email: email,
                password: password
            });
            setError('');
            console.log('Login successful:', response.data);
            localStorage.setItem('jwt', response.data.jwt);
            localStorage.setItem('userType',response.data.user_type);
            localStorage.setItem('name',response.data.name);
            navigate('/destinations');


        } catch (error) {
            setError("Invalid email or password!");
        }
    };

    return (
        <div className='form-container'>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className='form-form'>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                        placeholder='email'
                    />
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        placeholder='password'
                    />
                <button type="submit">Login</button>
                <div>
                    {error && <h3 className='error-message'>{error}</h3>}
                </div>
            </form>
        </div>
    );
}

export default Login;