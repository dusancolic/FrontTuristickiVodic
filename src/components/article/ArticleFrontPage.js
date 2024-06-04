import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import '../pagination/Pagination.css'
import Pagination from '../pagination/Pagination.js'

const articlesPerPage = 5;

const ArticleTable = () => {
  const [Articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [destinations, setDestinations] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(1);

  const fetchArticles = async (page,size) => {
    try {
     const response =  await fetch(`http://localhost:8080/api/articles/most-recent?page=${page}&size=${size}`, {
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
      data.destinations.forEach(destination => {
        destinationsMap[destination.id] = destination.name;
      });
  
      setDestinations(destinationsMap);
    } catch (err) {
      setError('Error fetching destinations');
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
      
    } catch (err) {
      if(err.message.includes('401'))
        setError('Unauthorized!');
    }
  };

  const handleClick = (id) => () => {
    fetchVisitArticles(id);
    navigate(`/articles/${id}`);
  };

  useEffect(() => {
    fetchArticles(currentPage,articlesPerPage);
    fetchDestinations();
  }, []);
  

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchArticles(page,articlesPerPage);
  };

  if(error) {
    return <div>{error}</div>;
  }

  return (
    <div>
        <h2>Most Recent Articles</h2>
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

export default ArticleTable;