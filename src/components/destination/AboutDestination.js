import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../pagination/Pagination.css';
import Pagination from '../pagination/Pagination.js';

const articlesPerPage = 5;

const AboutDestination = () => {
  const [Articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const { name } = useParams();

  const fetchArticles = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/articles/destination/${name}`, {
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
  }, [name]);

  const totalPages = Math.ceil(Articles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const paginatedArticles = Articles.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h2>Articles About {name}</h2>
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
              {paginatedArticles.map((Article) => (
                <tr key={Article.id}>
                  <td>{Article.title}</td>
                  <td>{name}</td>
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
