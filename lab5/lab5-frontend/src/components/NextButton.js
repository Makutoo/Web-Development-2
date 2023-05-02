

import { useQuery } from '@apollo/client';
import { makeStyles } from "@material-ui/core/styles";
import { getPlacesAPILocations} from '../queries.js';
import '../App.css';
import {
    Button
} from '@mui/material';


const useStyles = makeStyles((theme) => ({
    
    button: {
        margin: theme.spacing(1),
        width: "15%",
        backgroundColor: "#673ab7",
        color: "#fff",
        "&:hover": {
            backgroundColor: "#512da8",
        },
    }
    
}));

const NextButton = (props) => {
    const classes = useStyles();
    const {  data, refetch } = useQuery(getPlacesAPILocations, {
        manual: true
    })

    

   
    return (
        <Button onClick={() => {
            refetch()
            console.log(data)
            
        }} className={classes.button} variant="contained" color="primary" > GET MORE </Button>
    )
}

export default NextButton;