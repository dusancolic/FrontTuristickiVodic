import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './Pagination.css'
import Pagination from './Pagination.js'

const destinationsPerPage = 5;

const DestinationTable = () => {
  const [destinations, setDestinations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const fetchDestinations = async () => {
    try {
     const response =  await fetch('http://localhost:8080/api/destinations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
           'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
      
        
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      setDestinations(data);
      
    } catch (error) {
      console.error('Error:', error);
    }
  };
  useEffect(() => {
    fetchDestinations();
  }, []);



  const totalPages = Math.ceil(destinations.length / destinationsPerPage);
  const startIndex = (currentPage - 1) * destinationsPerPage;
  const endIndex = startIndex + destinationsPerPage;
  const paginatedDestinations = destinations.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = (name) => {
    navigate(`/destinations/edit/${name}`);
  }
  const handleDelete = async (name) => {
    try {
        await fetch(`http://localhost:8080/api/destinations/${name}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
            },
        });
       
        fetchDestinations();
        if (currentPage > 1 && destinations.length % destinationsPerPage === 1) {
          setCurrentPage(currentPage - 1);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedDestinations.map((destination) => (
            <tr key={destination.id}>
              <td>{destination.name}</td>
              <td>{destination.description}</td>
              <td>
                <button onClick={() => handleEdit(destination.name)}>Edit</button>
                <button onClick={() => handleDelete(destination.name)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
      <br />
      <button onClick={() => navigate('/destinations/add')}>Add new destination</button>

    </div>
  );
};

export default DestinationTable;