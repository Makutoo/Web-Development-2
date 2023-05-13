import {
    Box,
    Button,
    ButtonGroup,
    Card,
    Grid,
    Stack,
    TextField,
    Typography,
    CardHeader,
    CardActions,
    CardMedia,
  } from "@mui/material";
  import React, { useContext } from "react";
  import { Link } from "react-router-dom";
  import { makeStyles } from  '@material-ui/core/styles';
  import CollectorsContext from "../context/CollectorsContext";
  
  const useStyles = makeStyles((theme) => ({
    root: {
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
    header: {
      fontWeight: "bold",
      letterSpacing: 3,
      textTransform: "uppercase",
      textAlign: "center",
    },
    card: {
      margin: theme.spacing(1),
    },
  }));
  
  export default function Collectors() {
    const { currentCollector, setCurrentCollector, allCollectors, setAllCollectors } = useContext(CollectorsContext);
    const classes = useStyles();
    function createCollector() {
      const newCollector = document.getElementById("new_collector").value.trim();
      if (newCollector === "") {
        alert("input should not be empty!");
        return;
      }
      if (allCollectors[newCollector]) {
        alert(newCollector + " has exist, please input another name!");
      } else {
        const temp = { ...allCollectors, [newCollector]: [] }
        setAllCollectors(temp);
        localStorage.setItem('allCollectors', JSON.stringify(temp)); 
      }
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
    
    return (
      <Stack justifyContent="center" alignItems="center" spacing={1}>
        <Grid container my={1} justifyContent="center" alignItems="center">
          <Grid item xs={1.5}>
            <TextField id="new_collector" label="Name" />
          </Grid>
          <Grid item xs={1.2}>
            <Button style={{ backgroundColor: 'black', color: 'white' }} onClick={createCollector} variant="contained" size="large">
              Creat a new collector
            </Button>
          </Grid>
        </Grid>
        {Object.keys(allCollectors).map((collector) => {
          return (
            <Stack className={classes.root} key={collector} p={2}>
              <Box>
                <Typography className={classes.header} variant="h5">Collector: {collector}</Typography>
                {currentCollector === collector ? (
                  <ButtonGroup variant="text">
                    <Button disabled color="secondary">
                      Select
                    </Button>
                    <Button disabled color="error">
                      Delete
                    </Button>
                  </ButtonGroup>
                ) : (
                  <ButtonGroup variant="text">
                    <Button
                      color="secondary"
                      onClick={() => {
                        setCurrentCollector(collector);
                      }}
                    >
                      Select
                    </Button>
                    <Button
                      color="error"
                      onClick={() => {
                        const temp = { ...allCollectors };
                        delete temp[collector];
                        setAllCollectors(temp);
                        localStorage.setItem('allCollectors', JSON.stringify(temp));
                      }}
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                )}
              </Box>
              <Grid container alignItems="center" spacing={2}>
                {allCollectors[collector].map((character) => {
                  return (
                    <Grid item key={character.id} xs={6} sm={4} md={3}>
                      <Card className={classes.card}>
                        <CardHeader
                          title={character.name}
                          titleTypographyProps={{
                            letterSpacing: 3,
                            textTransform: "uppercase",
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        />
                        <Link to={`/marvel-characters/${character.id}`}>
                          <CardMedia
                            component="img"
                            image={character.image}
                            alt={character.id}
                          />
                        </Link>
                        <CardActions>
                        {currentCollector === collector ?
                          <Button variant="contained" onClick={() => giveUpCharacter(character)}> Give Up </Button> :
                          <Button variant="contained" disabled color="error" > Give Up </Button>}
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Stack>
          );
        })}
      </Stack>
    );
  }
  