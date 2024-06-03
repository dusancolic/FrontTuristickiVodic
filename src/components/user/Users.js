import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import '../pagination/Pagination.css'
import Pagination from '../pagination/Pagination.js'

const usersPerPage = 5;

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  const fetchUsers = async (page,size) => {
    try {
     const response =  await fetch(`http://localhost:8080/api/users?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
           'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
      console.log(response);
        
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.totalPages);
      
    } catch (error) {
      setError('Error fetching users');
    }
  };
  useEffect(() => {
    fetchUsers(currentPage,usersPerPage);
  }, []);


  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchUsers(page,usersPerPage);
  };

  const handleEdit = (email) => {
    navigate(`/users/edit/${email}`);
  }
  const handleActivation = async (email) => {
    try {
        await fetch(`http://localhost:8080/api/users/changeActivity/${email}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
            },
        });

        fetchUsers(currentPage,usersPerPage);
    } catch (error) {
        console.error('Error:', error);
    }
}

  if(error)
    return <div>{error}</div>;

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Email</th>
            <th>User Type</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.surname}</td>
              <td>{user.email}</td>
              <td>{user.userType}</td>
              <td>{user.active? 'Activated' : "Deactivated"}</td>
              <td>
                <button onClick={() => handleEdit(user.email)}>Edit</button>
                  {user.userType !== 'ADMIN' && (
                    <button onClick={() => handleActivation(user.email)}>
                      {user.active ? 'Deactivate' : 'Activate'}
                    </button>
                   )}              
            </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
      <br />
      <button onClick={() => navigate('/users/register')}>Register user</button>

    </div>
  );
};

export default UserTable;