import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import marvelImage from '../img/Marvel.webp';
const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundImage: `url(${marvelImage})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    color: '#ffffff',
  },
  text: {
    textAlign: 'center',
    marginTop: '-40%',
    color: '#000000'
  },
  accentText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  bodyText: {
    color: 'White',
    
  },
});

function Home() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.text}>
        <Typography variant="h2" gutterBottom>
          <p className={classes.accentText}>Marvel Collector</p>
        </Typography>
        <Typography variant="h5" gutterBottom>
          <p className={classes.bodyText}>1. Used Context API state persists on a page refresh </p>
        </Typography>
        <Typography variant="h5" gutterBottom>
          <p className={classes.bodyText}>2. Implemented a search functionality for finding individual Characters </p>
        </Typography>
        <Typography variant="h5" gutterBottom>
          <p className={classes.bodyText}>3. Implemented own custom GraphQL backend instead of an Express backend </p>
        </Typography>
      </div>
    </div>
  );
}

export default Home;
