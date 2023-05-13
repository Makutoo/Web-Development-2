import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import zombieImage from '../img/zombie.avif';


const useStyles = makeStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundImage: `url(${zombieImage})`,
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
  });

const NoCharacter = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography variant="h2" gutterBottom>
                <span className={classes.accentText}>Opps, no characters match the search... </span>
            </Typography>
        </div>
        
    );
};

export default NoCharacter;