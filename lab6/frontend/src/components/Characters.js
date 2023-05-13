import { makeStyles } from '@material-ui/core/styles';
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import CollectorsContext from "../context/CollectorsContext";
import NoCharacter from './NoCharacters';
import {
    Stack,
    Grid,
    Card,
    Button,
    CardMedia,
    CardHeader,
    CardActions,
} from "@mui/material";

const useStyles = makeStyles((theme) => ({
    
    myStack: {
      background: '#eee',
      padding: theme.spacing(2),
    },
    
    myGrid: {
      padding: theme.spacing(5),
    },
 
    myCardHeader: {
      backgroundColor: 'black',
      color: 'white',
    },
  }));

const Characters = (props) => {
    const characters = props.characters
    const classes = useStyles();
    const { currentCollector, allCollectors, setAllCollectors } = useContext(CollectorsContext);

    function collectCharacter(character) {
        if (allCollectors[currentCollector].length >= 10) {
          alert("A collector has up to 10 characters!");
          return;
        }
        const temp = { ...allCollectors, [currentCollector]: [...allCollectors[currentCollector], character] }
        setAllCollectors(temp);
        localStorage.setItem('allCollectors', JSON.stringify(temp)); 
    }

    function giveUpCharacter(character) {
        const temp = { 
          ...allCollectors, 
          [currentCollector]: [...allCollectors[currentCollector]].filter((ele) => {
            return ele.id !== character.id;
        })};
        setAllCollectors(temp)
        localStorage.setItem('allCollectors', JSON.stringify(temp)); 
    }
    
    if(characters.length === 0) {
        return <NoCharacter />
    }
    return (
        <Stack justifyContent="center" alignItems="center" spacing={2} className={classes.myStack}>
            <Grid container spacing={5} justifyContent="center" alignItems="center" className={classes.myGrid}>
                {characters.map((item) => {
                    return (
                        <Grid item key={item.id} xs={6} sm={4} md={3} className={classes.myGrid}>
                            <Card sx={{ textDecoration: "none" }} className={classes.myCardHeader}>
                                <CardHeader
                                    title={item.name}
                                    titleTypographyProps={{
                                        letterSpacing: 3,
                                        textTransform: "uppercase",
                                        textAlign: "center",
                                        fontWeight: "bold",
                                    }}
                                    className={classes.myCardHeader}
                                />
                                <Link to={`/marvel-characters/${item.id}`}>
                                    <CardMedia component="img" image={item.image} alt={item.id}/>
                                </Link>

                                {currentCollector ? (
                                    <CardActions >
                                        {allCollectors[currentCollector].map((ele) => ele.id).includes(item.id) ? (
                                            <Button
                                                variant="contained"
                                                onClick={() => giveUpCharacter(item)}
                                            >
                                                Give Up
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                onClick={() => collectCharacter(item)}
                                            >
                                                Collect
                                            </Button>
                                        )}
                                    </CardActions>
                                ) : (
                                    <CardActions>
                                        <Button variant="contained" disabled>
                                            COLLECT / GIVE UP
                                        </Button>
                                    </CardActions>
                                )}
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Stack>
    )
};

export default Characters;