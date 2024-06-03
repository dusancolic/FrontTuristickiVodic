import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterUser() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [user_type, setUserType] = useState('');  
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('jwt');
            const response = await axios.post('http://localhost:8080/api/users/register', {
                name: name,
                surname: surname,
                email: email,
                password: password,
                userType: user_type

            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Add successful:', response.data);
            navigate('/users');
    
        } catch (error) {
            if(error.response.status === 401)
                setError('Unauthorized!');
            else if (error.response.status === 400) {
                setError('Invalid user type!');
                setUserType('');
            }
            else {
                setError('User with this email already exists!');
                setEmail('');
            }
        }

    };

    return (
        
        <div className='form-container'>
        <h2>Register User</h2>
        <form onSubmit={handleSubmit} className='form-form'>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder='name'
            />
            <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
                placeholder='surname'
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder='email'
            />
            <input
                type="text"
                value={user_type}
                onChange={(e) => setUserType(e.target.value)}
                required
                placeholder='user type'
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder='password'
            />
            <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
                placeholder='confirm password'
            />
            {
              password === password2 && password !== '' && <button type="submit">Confirm</button>
            }
            
            <div>
                {error && <h3 className='error-message'>{error}</h3>}
            </div>
        </form>
    </div>
        
    );
}

export default RegisterUser;