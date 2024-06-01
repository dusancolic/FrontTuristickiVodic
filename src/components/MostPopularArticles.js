import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './pagination/Pagination.css'
import Pagination from './pagination/Pagination.js'

const articlesPerPage = 5;

const PopularArticlesTable = () => {
  const [Articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [destinations, setDestinations] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchArticles = async () => {
    try {
     const response =  await fetch('http://localhost:8080/api/articles/most-visited', {
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
      setArticles(data);
      
    } catch (error) {
      setError('Error fetching articles');
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
      data.forEach(destination => {
        destinationsMap[destination.id] = destination.name;
      });
  
      setDestinations(destinationsMap);
    } catch (err) {
      setError('Error fetching destinations');
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchDestinations();
  }, []);



  const totalPages = Math.ceil(Articles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const paginatedArticles = Articles.slice(startIndex, endIndex);
  

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
        <h2>Most Popular Articles</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Destination</th>
            <th>Text</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {paginatedArticles.map((Article) => (
            <tr key={Article.id}>
              <td>{Article.title}</td>
              <td>{destinations[Article.destinationId]}</td>
              <td>{Article.text.length > 50 ? `${Article.text.slice(0, 50)}...` : Article.text}</td>
              <td>{Article.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
      
    </div>
  );
};

export default PopularArticlesTable;