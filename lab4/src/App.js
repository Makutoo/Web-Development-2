import Home from './components/Home';
import Event from './components/Event';
import EventList from './components/EventList';
import Attraction from './components/Attraction';
import AttractionList from './components/AttractionList';
import Venue from './components/Venue';
import VenueList from './components/VenueList';
import logo from './img/TM-Verified.svg';
import { Route, Routes, Link } from "react-router-dom"
import './App.css';

function App() {
  return (
    <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>
            Welcome to the TicketMaster 
          </h1>
        </header>
        <br />
        <Link className='link' to='/'>
            Home
        </Link> 
        <Link className='link' to='/events/page/0'>
            Events
        </Link> 
        <Link className='link' to='/attractions/page/0'>
            Attractions
        </Link> 
        <Link className='link' to='/venues/page/0'>
            Venues  
        </Link> 
        <br />
        <div className='App-body'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/events/:id' element={<Event />} />
            <Route path='/events/page/:page' element={<EventList />} />
            <Route path='/attractions/:id' element={<Attraction />} />
            <Route path='/attractions/page/:page' element={<AttractionList />} />
            <Route path='/venues/:id' element={<Venue />} />
            <Route path='/venues/page/:page' element={<VenueList />} />
          </Routes>
        </div>
    </div>
  );
}

export default App;
