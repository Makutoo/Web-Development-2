import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';


const useStyles = makeStyles({
    formContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  });

const SearchForm = (props) => {
    const classes = useStyles();
    const handleChange = (e) => {
        props.searchValue(e.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
       
        <form onSubmit={handleSubmit} className={classes.form}>
            <TextField label="Search" variant="outlined" onChange={handleChange} />
        </form>
        
    );
};

export default SearchForm;