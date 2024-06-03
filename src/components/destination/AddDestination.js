import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Form.css';


function AddDestination() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('jwt');
            const response = await axios.post('http://localhost:8080/api/destinations', {
                name: name,
                description: description
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Add successful:', response.data);
            navigate('/destinations');
    
        } catch (error) {
            if(error.message.includes('401'))
                setError('Unauthorized!');
            else (error.message.includes('400')) 
                setError('Invalid name!');
            
            setDescription('');
            setName('');
        }
       
    };

    return (
        
            <div className='form-container'>
            <h2>Add Destination</h2>
            <form onSubmit={handleSubmit} className='form-form'>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder='name'
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        placeholder='description'
                    />
                <button type="submit">Add</button>
                <div>
                    {error && <h3 className='error-message'>{error}</h3>}
                </div>
            </form>
            </div>
        
    );
}

export default AddDestination;