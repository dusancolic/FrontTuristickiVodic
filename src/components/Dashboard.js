import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import useAuthRedirect from '../hooks/useAuthRedirect';

const Dashboard = () => {
    const logged = !!localStorage.getItem('jwt');
    const admin = !!localStorage.getItem('user_type')
    useAuthRedirect();
    return (
        logged &&
        <nav>
            <ul>
                <li>
                    <Link to="/">Login</Link>
                </li>    
                <li>
                    <Link to="/destinations">Destinations</Link>
                </li>
                <li>
                    <Link to="/users">Users</Link>
                </li>
            </ul>    
        </nav>
    );
};

export default Dashboard;