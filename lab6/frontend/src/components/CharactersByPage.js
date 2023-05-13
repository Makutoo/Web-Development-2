import { makeStyles } from '@material-ui/core/styles';
import {
    Pagination,
    Stack,
    
  } from "@mui/material";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import queries from "../queries";

import Characters from "./Characters";
  
const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiPagination-ul': {
        justifyContent: 'center',
        '& button': {
          color: 'white',
          backgroundColor: 'red',
          '&:hover': {
            backgroundColor: 'darkred',
          },
        },
        '& .Mui-selected': {
          backgroundColor: 'darkred',
          color: 'white',
          '&:hover': {
            backgroundColor: 'darkred',
          },
        },
      },
    },
  }));

  export default function CharactersByPage() {
    const classes = useStyles();
    const navigate = useNavigate();
    const [page, setPage] = useState(parseInt(useParams().pagenum));
    const { loading, error, data } = useQuery(queries.getCharactersByPage, {
      variables: { pageNum: page },
      fetchPolicy: "network-only",
    });
    
  
    const handlePageChange = (_event, value) => {
      setPage(value - 1);
      navigate(`/marvel-characters/page/${value - 1}`);
    };
  
    if (loading) return "Loading...";
    if (error) return `404 not found!`;
  
    return (
      <Stack justifyContent="center" alignItems="center" spacing={2}>
        <Pagination
          sx={{ mt: 3 }}
          count={Math.ceil(1562 / 20)}
          page={page + 1}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
          className={classes.root}
        />
        <Characters characters={data.characters}/>
      </Stack>
    );
  }
  