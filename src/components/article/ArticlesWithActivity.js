import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../pagination/Pagination.css';
import Pagination from '../pagination/Pagination.js';
import { useNavigate } from 'react-router-dom';

const articlesPerPage = 5;

const ArticlesWithActivity = () => {
  const [Articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const [destinations, setDestinations] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

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
      if(err.message.includes('401'))
        setError('Unauthorized!');
      else
      setError('Error fetching destinations');
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/articles/activity/${id}`, {
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

  useEffect(() => {
    fetchArticles();
    fetchDestinations();
  }, [id]);

  const totalPages = Math.ceil(Articles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const paginatedArticles = Articles.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const fetchVisitArticles = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/articles/visit/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      }
    });
      
    } catch (err) {
      if(err.message.includes('401'))
        setError('Unauthorized!');
    }
  };

  const handleClick = (id) => () => {
    fetchVisitArticles(id);
    navigate(`/articles/${id}`);
  };

  return (
    <div>
      <h2>Articles With </h2>
      {error && <p className="error-message">{error}</p>}
      {Articles.length === 0 ? (
        <p>No articles for this activity</p>
      ) : (
        <>
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
                <tr key={Article.id} onClick={handleClick(Article.id)}>
                  <td>{Article.title}</td>
                  <td>{destinations[Article.destinationId]}</td>
                  <td>{Article.text.length > 50 ? `${Article.text.slice(0, 50)}...` : Article.text}</td>
                  <td>{Article.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

export default ArticlesWithActivity;
