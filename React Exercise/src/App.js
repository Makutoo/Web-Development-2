import React from 'react';
import logo from './img/tvm-header-logo.png';
import './App.css';
import ShowList from './components/ShowList';
import Show from './components/Show';
import Home from './components/Home';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>
            Welcome to the React.js TV Maze API Example
          </h1>
          <Link className='showlink' to='/'>
            Home
          </Link> 
          <Link className='showlink' to='/shows'>
            Shows
          </Link>
        </header>
        <br />
        <br />
        <div className='App-body'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/shows' element={<ShowList />} />
            <Route path='/shows/:id' element={<Show />} />
            <Route path='/shows/page/:page' element={<ShowList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
