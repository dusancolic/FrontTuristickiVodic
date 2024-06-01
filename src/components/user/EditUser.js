import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EditUser() {
    const { email } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [newEmail, setNewEmail] = useState('');

    const [user_type, setUserType] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${email}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
                console.log(response);
                console.log(email);
                setName(response.data.name);
                setSurname(response.data.surname);
                setNewEmail(response.data.email);
                setUserType(response.data.userType);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchUser();
    }, [email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8080/api/users/update`, {
                
                name: name,
                surname: surname,
                userType: user_type,
                newEmail: newEmail,
                oldEmail : email
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            console.log('Edit successful:', response.data);
            navigate('/users');
        } catch (error) {
            setError("Invalid email!");
        }
    };

    return (

        <div className='form-container'>
            <h2>Edit User</h2>
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
                    type="text"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
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
                
                <button type="submit">Confirm</button>
                <div>
                    {error && <h3 className='error-message'>{error}</h3>}
                </div>
            </form>
        </div>

    );
}

export default EditUser;