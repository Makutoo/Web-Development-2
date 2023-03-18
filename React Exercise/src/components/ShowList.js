import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import SearchShows from './SearchShows';
import noImage from '../img/download.jpeg';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  makeStyles,
  Button
} from '@material-ui/core';


import '../App.css';
const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 5,
    border: '1px solid #1e8678',
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);',
  },
  titleHead: {
    borderBottom: '1px solid #1e8678',
    fontWeight: 'bold',
  },
  grid: {
    flexGrow: 1,
    flexDirection: 'row',
  },
  media: {
    height: '100%',
    width: '100%',
  },
  button: {
    color: '#1e8678',
    fontWeight: 'bold',
    fontSize: 12,
  },
  prevButton: {
    color: '#1e8678',
    right: 300,
    fontWeight: 'bold',
    fontSize: 15,
  },
  nextButton: {
    color: '#1e8678',
    left: 300,
    fontWeight: 'bold',
    fontSize: 15,
  }
});

const ShowList = () => {
  let { page } = useParams();
  page = Number(page);
  const regex = /(<([^>]+)>)/gi;
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState(undefined);
  const [showsData, setShowsData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNum, setPageNum] = useState(page ? page : 0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const navigate = useNavigate()
  let cards = null;
  
  // useEffect(() => {
  //   console.log('on load useeffect');
  //   async function fetchData() {
  //     try {
  //       const {data} = await axios.get('http://api.tvmaze.com/shows');
  //       setShowsData(data);
  //       setLoading(false);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  //   fetchData();
  // }, []);

  useEffect(() => {
    console.log('on load useeffect');
    async function fetchData() {
      try {
        const { data } = await axios.get(`https://api.tvmaze.com/shows?page=${pageNum}`);
        setShowsData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [pageNum]);

  useEffect(() => {
    console.log('search useEffect fired');
    async function fetchData() {
      try {
        console.log(`in fetch searchTerm: ${searchTerm}`);
        const { data } = await axios.get(
          'http://api.tvmaze.com/search/shows?q=' + searchTerm
        );
        setSearchData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    if (searchTerm) {
      console.log('searchTerm is set');
      fetchData();
    }
  }, [searchTerm]);

  // why this?? 
  const searchValue = async (value) => {
    setSearchTerm(value);
  };


  const buildCard = (show) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={show.id}>
        <Card className={classes.card} variant='outlined'>
          <CardActionArea>
            <Link to={`/shows/${show.id}`}>
              <CardMedia
                className={classes.media}
                component='img'
                image={
                  show.image && show.image.original
                    ? show.image.original
                    : noImage
                }
                title='show image'
              />

              <CardContent>
                <Typography
                  className={classes.titleHead}
                  gutterBottom
                  variant='h6'
                  component='h3'
                >
                  {show.name}
                </Typography>
                <Typography variant='body2' color='textSecondary' component='p'>
                  {show.summary
                    ? show.summary.replace(regex, '').substring(0, 139) + '...'
                    : 'No Summary'}
                  <span>More Info</span>
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };


  /* warp data to card, and save each card into array cards*/
  if (searchTerm) {
    cards =
      searchData &&
      searchData.map((shows) => {
        let { show } = shows;
        return buildCard(show);
      });
  } else {
    cards =
      showsData &&
      showsData.map((show) => {
        return buildCard(show);
      });
  }

  
  async function getNextNextPage() {
    try {
      await axios.get(`https://api.tvmaze.com/shows?page=${Number(pageNum + 2)}`);
    } catch (e) {
      setHasNextPage(false)
      return
    }
    setHasNextPage(true)
  }
  const toNextPage = () => {
    getNextNextPage()
    let path = `/shows/page/${Number(pageNum) + 1}`;
    setPageNum(pageNum + 1)
    navigate(path);
  }

  const toPrevPage = () => {
    if (pageNum > 0) {
      let path = `/shows/page/${Number(pageNum) - 1}`;
      setPageNum(pageNum - 1)
      setHasNextPage(true)
      navigate(path);
    }
  }


  /* Here doing the return for this component */
  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <div>
        <SearchShows searchValue={searchValue} /> {/* the searchValue is just the setSearchTerm funcion*/}
        <br />
        <h1>{pageNum}</h1>
        {pageNum > 0 ? (
          <Button className={classes.prevButton} variant="outlined" onClick={toPrevPage}> Prev </Button>
        ) : (
          <Button className={classes.prevButton} variant="outlined" disabled > Prev </Button>
        )}

        {hasNextPage  ? (
          <Button className={classes.nextButton} variant="outlined" onClick={toNextPage}> Next </Button>
        ) : (
          <Button className={classes.nextButton} variant="outlined" disabled > Next </Button>
        )}

        

        <br />
        <br />
        <Grid container className={classes.grid} spacing={5}>
          {cards}
        </Grid>
      </div>
    );
  }
};

export default ShowList;
