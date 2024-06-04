import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../pagination/Pagination.css';
import './AboutArticle.css';
import Pagination from '../pagination/Pagination.js';

const commentsPerPage = 5;

const AboutArticle = () => {
  const [article, setArticle] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [activities, setActivities] = useState({});
  const [destinations, setDestinations] = useState({});
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [comments, setComments] = useState([]);
  const { id } = useParams();
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/articles/${id}`, {
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
      setArticle(data);
    } catch (error) {
      setError('Error fetching article');
      console.error('Error fetching article:', error);
    }
  };

  const fetchComments = async (page,size) => {
    try {
      const response = await fetch(`http://localhost:8080/api/comments/article/${id}?page=${page}&size=${size}`, {
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
      setComments(data.comments);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError('Error fetching comments');
      console.error('Error fetching comments:', error);
    }
  };

  const fetchDestinations = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/destinations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
      const data = await response.json();

      const destinationsMap = {};
      data.destinations.forEach(destination => {
        destinationsMap[destination.id] = destination.name;
      });

      setDestinations(destinationsMap);
    } catch (err) {
      setError('Error fetching destinations');
      console.error('Error fetching destinations:', err);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/activities', {
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
      const activitiesMap = {};
      data.forEach(activity => {
        activitiesMap[activity.id] = activity.name;
      });
      setActivities(activitiesMap);
    } catch (err) {
      if(err.message.includes('401'))
        setError('Unauthorized!');
      else
        setError('Error fetching activities');
      console.error('Error fetching activities:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        },
        body: JSON.stringify({
          author: author,
          text: text,
          articleId: id,
          date: new Date().toISOString().split('T')[0].toString(),
        }),
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      fetchComments(currentPage,commentsPerPage);
      console.log(comments);
      setAuthor('');
      setText('');
    } catch (error) {
      setError('Error adding comment');
      console.error('Error adding comment:', error);
    }
  };

  useEffect(() => {
    fetchArticle();
    fetchDestinations();
    fetchComments(currentPage,commentsPerPage);
    fetchActivities();
  }, []);



  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchComments(page,commentsPerPage);
  };

  const handleClick = (activityId) => {
    return () => {
      localStorage.setItem('activity', activities[activityId]);
    };
  }

  return (
    <div className="about-article">
      <h2>About {article.title}</h2>
      <p><strong>Author:</strong> {article.author}</p>
      <p><strong>Date:</strong> {article.date}</p>
      <p><strong>Text:</strong> {article.text}</p>
      <p><strong>Destination:</strong> {destinations[article.destinationId]}</p>
      <p><strong>Activities:</strong> 
        {article.activities && article.activities.map(activityId => (
          <a onClick={handleClick(activityId)} key={activityId} href={`/articles/activity/${activityId}`}>{activities[activityId]} </a>
        ))}
      </p>
      {comments.length === 0 ? (
        <p>No comments for this article</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Author</th>
                <th>Text</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr key={comment.id}>
                  <td>{comment.author}</td>
                  <td>{comment.text}</td>
                  <td>{comment.date}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-container">
            <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
          </div>
        </>
      )}
      <div className='form-container'>
        <h3>Add Comment</h3>
        <form onSubmit={handleSubmit} className='form-form'>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            placeholder='author'
          />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            placeholder='text'
          />
          <button type="submit">Add comment</button>

          <div>
            {error && <h3 className='error-message'>{error}</h3>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AboutArticle;
