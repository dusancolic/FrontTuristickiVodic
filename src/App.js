import './App.css';
import AddDestination from './components/AddDestination';
import Dashboard from './components/Dashboard';
import DestinationTable from './components/Destination';
import EditDestination from './components/EditDestination';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import Login from './components/Login';
import Users from './components/Users';
import EditUser from './components/EditUser';


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

          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
