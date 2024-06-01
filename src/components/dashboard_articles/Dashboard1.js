import React from 'react';
import { Link } from 'react-router-dom';
import '../dashboard/Dashboard.css';
import useAuthRedirect from '../../hooks/useAuthRedirect';

const Dashboard1 = () => {
    const logged = !!localStorage.getItem('jwt');
    useAuthRedirect();

    return (
        logged && (
            <>
                <nav className="navbar">
                    <ul className="nav-list">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/destination/popular" className="nav-link">Most Popular</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/destination/about" className="nav-link">About Destination</Link>
                        </li>
                    </ul>
                    
                </nav>
                <div className="content">
                    {/* Main content goes here */}
                </div>
            </>
        )
    );
};

export default Dashboard1;
