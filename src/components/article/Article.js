import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import '../pagination/Pagination.css'
import Pagination from '../pagination/Pagination.js'

const articlesPerPage = 5;

const Articles = () => {
  const [Articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [destinations, setDestinations] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchArticles = async () => {
    try {
     const response =  await fetch('http://localhost:8080/api/articles', {
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
  const handleEdit = (id) => {
     navigate(`/articles/edit/${id}`);
    //  window.open(`/articles`, '_blank');
   }
   const handleDelete = async (id) => {
     try {
         await fetch(`http://localhost:8080/api/articles/${id}`, {
             method: 'DELETE',
             headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
             },
         });
        
         fetchArticles();
         if (currentPage > 1 && Articles.length % articlesPerPage === 1) {
           setCurrentPage(currentPage - 1);
         }
 
     } catch (error) {
         console.error('Error:', error);
     }
 }
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

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
        <h2>All Articles</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Destination</th>
            <th>Text</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedArticles.map((Article) => (
            <tr key={Article.id} onClick={handleClick(Article.id)}>
              <td>{Article.title}</td>
              <td>{destinations[Article.destinationId]}</td>
              <td>{Article.text.length > 50 ? `${Article.text.slice(0, 50)}...` : Article.text}</td>
              <td>{Article.date}</td>
              <td>
                <button onClick={(e) => { e.stopPropagation(); handleEdit(Article.id); }}>Edit</button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(Article.id); }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
      <br />
      <button onClick={() => navigate('/articles/add')}>Add new article</button>
    </div>
  );
};

export default Articles;