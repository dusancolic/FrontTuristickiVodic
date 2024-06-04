import React, { useState, useEffect } from 'react';
import '../pagination/Pagination.css';
import Pagination from '../pagination/Pagination.js';
import { useNavigate } from 'react-router-dom';

const articlesPerPage = 5;

const AboutDestination = () => {
  const [Articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const destination  = localStorage.getItem("destination");
  
  const [totalPages, setTotalPages] = useState(1);
 

  const fetchArticles = async (page,size) => {
    try {
      const response = await fetch(`http://localhost:8080/api/articles/destination/${destination}?page=${page}&size=${size}`, {
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
      setArticles(data.articles);
      setTotalPages(data.totalPages);
    } catch (error) {
      if(error.message.includes('401'))
        setError('Unauthorized!');
      else 
        setError('Error fetching articles');
    }
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
      
    } catch (error) {
      if(error.message.includes('401'))
        setError('Unauthorized!');
    }
  };

  const handleClick = (id) => () => {
    fetchVisitArticles(id);
    navigate(`/articles/${id}`);
  };

  useEffect(() => {
    fetchArticles(currentPage,articlesPerPage);
  }, [destination]);


  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchArticles(page,articlesPerPage);
  };

    if (error) {
      return <p className="error-message">{error}</p>;
    }
  return (
    <div>
      <h2>Articles About {destination}</h2>
      {error && <p className="error-message">{error}</p>}
      {Articles.length === 0 ? (
        <p>No articles for this destination</p>
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
              {Articles.map((Article) => (
                <tr key={Article.id} onClick={handleClick(Article.id)}>
                  <td>{Article.title}</td>
                  <td>{destination}</td>
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

export default AboutDestination;
