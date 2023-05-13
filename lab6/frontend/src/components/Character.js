import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import { Button, Grid, Typography } from "@mui/material";
import CollectorsContext from "../context/CollectorsContext";

export default function Character() {
  const id = useParams().id;
  const { loading, error, data } = useQuery(queries.getCharacterById, {
    variables: { id },
    fetchPolicy: 'network-only'
  });
  const { currentCollector, allCollectors, setAllCollectors } = useContext(CollectorsContext);

  if (loading) return "Loading...";
  if (error) return `404 not found!`;

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

  return (
    <Grid
      direction="column"
      container
      spacing={5}
      justifyContent="center"
      alignItems="center"
      my={2}
    >
      <Grid item>
        <Typography
          letterSpacing="3"
          textTransform="uppercase"
          textAlign="center"
          fontWeight="bold"
        >
          {data.character.name}
        </Typography>
      </Grid>
      <Grid item>
        <img src={data.character.image} alt={`${data.character.id}img`} />
      </Grid>
      <Grid item>
        <Typography fontWeight="bold" fontFamily="monospace" textAlign="center">
          ID: {data.character.id ? data.character.id : "N/A"}
        </Typography>
        <Typography fontWeight="bold" fontFamily="monospace" textAlign="center">
          Description: {data.character.description ? data.character.description : "N/A"}
        </Typography>
        <Typography fontWeight="bold" fontFamily="monospace" textAlign="center">
          Modified: {data.character.modified ? data.character.modified : "N/A"}
        </Typography>
      </Grid>
      <Grid item>
        {currentCollector ? (
          allCollectors[currentCollector].map(ele => ele.id).includes(data.character.id) ? (
            <Button variant="contained" onClick={() => giveUpCharacter(data.character)}>
              Give Up
            </Button>
          ) : (
            <Button variant="contained" onClick={() => collectCharacter(data.character)}>
              Collect
            </Button>
          )
        ) : (
          <Button sx={{ mx: 1 }} variant="contained" disabled>
            Collect / Give Up
          </Button>
        )}
      </Grid>
    </Grid>
  );
}