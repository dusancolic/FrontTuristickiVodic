
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EditDestination() {
    const {name} = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [description1, setDescription1] = useState('');
    const [name1, setName1] = useState('');
    const [id, setId] = useState('');

    useEffect(() => {
        const fetchDestination = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/destinations/${name}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                 })
                ;
                setName1(response.data.name);
                setDescription1(response.data.description);
                setId(response.data.id);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        
        fetchDestination();
    }, [name]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8080/api/destinations`, {
                id : id,
                name: name1,
                description: description1
            },
            {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }})
;
            console.log('Edit successful:', response.data);
            navigate('/destinations');
        } catch (error) {
            setError("Invalid name!");
        }
    };

    return (
       
        <div className='form-container'>
        <h2>Edit Destination</h2>
        <form onSubmit={handleSubmit} className='form-form'>
                <input
                    type="text"
                    value={name1}
                    onChange={(e) => setName1(e.target.value)}
                    required
                    placeholder='name'
                />
                <textarea
                    value={description1}
                    onChange={(e) => setDescription1(e.target.value)}
                    required
                    placeholder='description'
                />
            <button type="submit">Confirm</button>
            <div>
                {error && <h3 className='error-message'>{error}</h3>}
            </div>
        </form>
        </div>
        
    );
}

export default EditDestination;