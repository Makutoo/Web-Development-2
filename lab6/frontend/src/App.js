import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";

import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import Home from "./components/Home";
import CharactersByPage from "./components/CharactersByPage";
import Character from "./components/Character";
import Collectors from "./components/Collectors";
import CharacterBySearch from "./components/CharacterBySearch";
import CollectorsContext from "./context/CollectorsContext";






const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

const useStyles = makeStyles((theme) => ({
  toolBar: {
    backgroundColor: 'black',
    color: 'red',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));


function App() {
  const classes = useStyles();
  const [currentCollector, setCurrentCollector] = useState("");
  const [allCollectors, setAllCollectors] = useState({});

  useEffect(() => {
    const savedAllCollectors = localStorage.getItem('allCollectors');
    if (savedAllCollectors) {
      setAllCollectors(JSON.parse(savedAllCollectors));
    }
  }, []);


  return (  
    <ApolloProvider client={client}>
      <CollectorsContext.Provider value={{ currentCollector, setCurrentCollector, allCollectors, setAllCollectors }}>
        <Router>
          <AppBar position="static" color="primary"  enableColorOnDark>
            <Toolbar className={classes.toolBar}>
              <Button
                size="large"
                component={NavLink}
                to="/"
                sx={{
                  mx: 2,
                  letterSpacing: ".3rem",
                  color: "inherit",
                }}
              >
                Home
              </Button>
              <Button
                size="large"
                component={NavLink}
                to="/marvel-characters/page/0"
                sx={{
                  mx: 2,
                  letterSpacing: ".2rem",
                  color: "inherit",
                }}
              >
                Characters
              </Button>
              <Button
                size="large"
                component={NavLink}
                to="/collectors"
                sx={{
                  mx: 2,
                  letterSpacing: ".2rem",
                  color: "inherit",
                }}
              >
                Collectors
              </Button>
              <Button
                size="large"
                component={NavLink}
                to="/search"
                sx={{
                  mx: 2,
                  letterSpacing: ".2rem",
                  color: "inherit",
                }}
              >
                Search
              </Button>
              <Typography align="right" color="white" flexGrow="1" variant="body1">
                CURRENT COLLECTOR: {currentCollector ? currentCollector : "NULL"}
              </Typography>
            </Toolbar>
          </AppBar>
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marvel-characters/page/:pagenum" element={<CharactersByPage />} />
            <Route path="/marvel-characters/:id" element={<Character />} />
            <Route path="/collectors" element={<Collectors />} />
            <Route path="/search" element={<CharacterBySearch />} />
          </Routes>
          
        </Router>
      </CollectorsContext.Provider>
    </ApolloProvider>
  );
}

export default App;
