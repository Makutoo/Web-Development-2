import { Route, Routes, Link } from "react-router-dom"
import LocationsList from "./components/LocationList";
import PostForm from "./components/PostForm";

import './App.css';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className='App-title'>
          BoreSquare
        </h1>
      </header>
      <br />
        <Link className='link' to='/'>
            Main
        </Link> 
        <Link className='link' to='/my-likes'>
            My Liked
        </Link> 
        <Link className='link' to='/my-locations'>
            My Posted
        </Link> 
        <Link className='link' to='/new-location'>
            Make A Post  
        </Link> 
        <br />
        <br />
        <br />
      <div className='App-body'>
          <Routes>
            <Route path='/' element={<LocationsList page='Main' />} />
            <Route path='/my-likes' element={<LocationsList page='Liked' />} />
            <Route path='/my-locations' element={<LocationsList page='Posted' />} />
            <Route path='/new-location' element={<PostForm />} />
          </Routes>
        </div>
    </div>
  );
}

export default App;
