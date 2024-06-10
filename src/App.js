import './App.css';
import AddDestination from './components/destination/AddDestination';
import Dashboard from './components/dashboard/Dashboard';
import DestinationTable from './components/destination/Destination';
import EditDestination from './components/destination/EditDestination';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import Login from './components/user/Login';
import Users from './components/user/Users';
import EditUser from './components/user/EditUser';
import RegisterUser from './components/user/RegisterUser';
import ArticleTable from './components/article/ArticleFrontPage';
import PopularArticlesTable from './components/article/MostPopularArticles';
import Articles from './components/article/Article';
import AddArticle from './components/article/AddArticle';
import EditArticle from './components/article/EditArticle';
import AboutDestination from './components/destination/AboutDestination';
import ArticlesWithActivity from './components/article/ArticlesWithActivity';
import AboutArticle from './components/article/AboutArticle';

function App() {
  return (
    <div className="App">
      <header className="App-header" >
        
        <Router>
        <Dashboard />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/destinations"  element={<DestinationTable />} />
            <Route path="/destinations/add" element={<AddDestination />} />
            <Route path="/destinations/edit/:name" element={<EditDestination />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/edit/:email" element={<EditUser />} />
            <Route path="/users/register" element={<RegisterUser />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/add" element={<AddArticle />} />
            <Route path="/articles/edit/:id" element={<EditArticle />} />
            <Route path="/destination/popular" element={<PopularArticlesTable />} />
            <Route path="/articles/about" element={<ArticleTable/>} />
            <Route path="/articles/activity/:id" element={<ArticlesWithActivity/>} />
            <Route path="/articles/:id" element={<AboutArticle/>} />
            <Route path="/destination/about/:name" element={<AboutDestination/>} />

          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
