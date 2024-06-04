import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../Form.css';

function EditArticle() {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [destinations, setDestinations] = useState({});
    const [activities, setActivities] = useState({});
    const [selectedDestination, setSelectedDestination] = useState('');
    const [selectedActivities, setSelectedActivities] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const { id } = useParams(); 

    
    const fetchArticle = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/articles/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            const article = response.data;
            setTitle(article.title);
            setText(article.text);
            setSelectedDestination(article.destinationId);
            setSelectedActivities(article.activities);
        } catch (error) {
            if(error.message.includes('401'))
                setError('Unauthorized!');
            else  
                setError('Error fetching!');
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('jwt');
            const response = await axios.put(`http://localhost:8080/api/articles`, {
                id: id,
                text: text,
                title: title,
                date: new Date().toISOString().split('T')[0].toString(),
                destinationId: selectedDestination,
                activities: selectedActivities,
                author: localStorage.getItem('name')
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Edit successful:', response.data);
            navigate('/articles');
        } catch (error) {
            console.error('Error:', error);
            setError("Error editing article!");
        }
    };

    const fetchDestinations = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/destinations', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
                }
            });
            const data = await response.json();
            const destinationsMap = {};
            data.destinations.forEach(destination => {
                destinationsMap[destination.id] = destination.name;
            });
            setDestinations(destinationsMap);
        } catch (err) {
            setError('Error fetching destinations');
        }
    };

    const fetchActivities = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/activities', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
                }
            });
            const data = await response.json();
            const activitiesMap = {};
            data.forEach(activity => {
                activitiesMap[activity.id] = activity.name;
            });
            setActivities(activitiesMap);
        } catch (err) {
            setError('Error fetching activities');
        }
    };

    useEffect(() => {
        fetchDestinations();
        fetchActivities();
        fetchArticle();
    }, []);

    const handleActivitiesChange = (e) => {
        const options = e.target.options;
        const selected = [];
        for (const option of options) {
            if (option.selected) {
                selected.push(option.value);
            }
        }
        setSelectedActivities(selected);
    };

    return (
        <div className='form-container'>
            <h2>Edit Article</h2>
            <form onSubmit={handleSubmit} className='form-form'>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder='Title'
                />
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                    placeholder='Text'
                />
                <select
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    required
                >
                    <option value="" disabled>Select Destination</option>
                    {Object.entries(destinations).map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                    ))}
                </select>
                <select
                    multiple
                    value={selectedActivities}
                    onChange={handleActivitiesChange}
                    required
                >
                    <option value="" disabled>Select Activities</option>
                    {Object.entries(activities).map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                    ))}
                </select>
                <button type="submit">Save</button>
                <div>
                    {error && <h3 className='error-message'>{error}</h3>}
                </div>
            </form>
        </div>
    );
}

export default EditArticle;
