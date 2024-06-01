import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const logged = !!localStorage.getItem('jwt');
    const admin = localStorage.getItem('userType') === 'ADMIN';
    const name = localStorage.getItem('name');
    const navigate = useNavigate();
    useAuthRedirect();

    return (
        logged && (
            <>
                <nav className="navbar">
                    <ul className="nav-list">
                        <li className="nav-item">
                            <Link to="/destinations" className="nav-link">Destinations</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/articles" className="nav-link">Articles</Link>
                        </li>
                        {admin && (
                            <li className="nav-item">
                                <Link to="/users" className="nav-link">Users</Link>
                            </li>
                        )}
                    </ul>
                    {admin && (<span className="user-name">{name} (A)</span>)}
                    {!admin && (<span className="user-name">{name}</span>)}
                    <button className="nav-button" onClick={() => {
                        localStorage.removeItem('jwt');
                        localStorage.removeItem('userType');
                        localStorage.removeItem('name');
                        navigate('/');
                    }}>Logout</button>
                </nav>
                <div className="content">
                    {/* Main content goes here */}
                </div>
            </>
        )
    );
};

export default Dashboard;
