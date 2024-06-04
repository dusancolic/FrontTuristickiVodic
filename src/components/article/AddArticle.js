import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Form.css';

function AddArticle() {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [destinations, setDestinations] = useState({});
    const [activities, setActivities] = useState({});
    const [selectedDestination, setSelectedDestination] = useState('');
    const [activity, setActivity] = useState('');
    const [selectedActivities, setSelectedActivities] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('jwt');
            const response = await axios.post('http://localhost:8080/api/articles', {
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
            console.log('Add successful:', response.data);
            navigate('/articles');
        } catch (error) {
            console.error('Error:', error);
            setError("Invalid name!");
        }
        setTitle('');
        setText('');
        setSelectedDestination('');
        setSelectedActivities([]);
        setActivity('');
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
            if(err.response.status === 401) {
                setError('Unauthorized!');
            } 
            else 
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

    const handleAddActivity = async () => {
        try {
            const token = localStorage.getItem('jwt');
            const response = await axios.post('http://localhost:8080/api/activities', {
                name: activity
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Add successful:', response.data);
            fetchActivities();
        } catch (error) {
            console.error('Error:', error);
            setError("Invalid name!");
            setActivity('');
        }
       
    }

    return (
        <div className='form-container'>
            <h2>Add Article</h2>
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
                <button type="submit">Add</button>
                <br></br>
                <br></br>      
                <input
                    type="text"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    placeholder='add new activity'
                />
                <button onClick={handleAddActivity}>Add Activity</button>

                <div>
                    {error && <h3 className='error-message'>{error}</h3>}
                </div>
            </form>
        </div>
    );
}

export default AddArticle;
