import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Search from './Search';
import noImage from '../img/download.jpeg';
import '../App.css';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography
} from '@mui/material';



const EventList = () => {
    const [hasCurrentPage, setHasCurrentPage] = useState()
    const [searchData, setSearchData] = useState(undefined);
    const [eventsData, setEventsData] = useState(undefined);
    const [searchTerm, setSearchTerm] = useState('');
    let cards = null;
    let { page = 0 } = useParams();
    const prevPage = Number(page) - 1
    const nextPage = Number(page) + 1

    // only fire once 
    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?page=${page}&countryCode=US&apikey=GgAnU4sOLLqCdeo6o2HaCUZCMfj4neRM`);
                console.log(`page now is ${page}`)
                setHasCurrentPage(true)
                setEventsData(data._embedded.events);
            } catch (e) {
                setHasCurrentPage(false)
                console.log(e);
            }
        }
        fetchData();
    }, [page]);

    //fire when search term is changed
    useEffect(() => {
        async function fetchData() {
            try {
                console.log(`in fetch searchTerm: ${searchTerm}`);
                const { data } = await axios.get(
                    `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${searchTerm}&countryCode=US&apikey=GgAnU4sOLLqCdeo6o2HaCUZCMfj4neRM`
                );
                setSearchData(data._embedded.events);
            } catch (e) {
                console.log(e);
            }
        }
        if (searchTerm) {
            console.log('searchTerm is set');
            fetchData();
        }
    }, [searchTerm]);

    const searchValue = async (value) => {
        setSearchTerm(value);
    };

    const buildCard = (event) => {
        return (
            <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={event.id}>
                <Card
                    variant='outlined'
                    sx={{
                        maxWidth: 250,
                        height: 'auto',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        borderRadius: 5,
                        border: '1px solid #1e8678',
                        boxShadow:
                            '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
                    }}
                >
                    <CardActionArea>
                        <Link to={`/events/${event.id}`}>
                            <CardMedia
                                sx={{
                                    height: '100%',
                                    width: '100%'
                                }}
                                component='img'
                                image={
                                    event && event.images && event.images[0].url
                                        ? event.images[0].url
                                        : noImage
                                }
                                title='show image'
                            />

                            <CardContent>
                                <Typography
                                    sx={{
                                        borderBottom: '1px solid #1e8678',
                                        fontWeight: 'bold'
                                    }}
                                    gutterBottom
                                    variant='h6'
                                    component='h3'
                                >
                                    {event.name}
                                </Typography>
                                <Typography variant='body2' color='textSecondary' component='p'>
                                    {event && event.priceRanges && event.priceRanges[0]
                                        && event.priceRanges[0].currency && event.priceRanges[0].min && event.priceRanges[0].max
                                        ? `Price: ${event.priceRanges[0].min} -  ${event.priceRanges[0].max} ${event.priceRanges[0].currency}`
                                        : 'Price Unavailable'}
                                </Typography>
                                <Typography variant='body2' color='textSecondary' component='p'>
                                    {event && event.dates && event.dates.start && event.dates.start.localDate
                                        ? `StartDate: ${event.dates.start.localDate}`
                                        : 'StartDate Unavailable'}
                                </Typography>
                                <Typography variant='body2' color='textSecondary' component='p'>
                                    {event && event.dates && event.dates.start && event.dates.start.localTime
                                        ? `StartTime: ${event.dates.start.localTime}`
                                        : 'StartTime Unavailable'}
                                </Typography>
                            </CardContent>
                        </Link>
                    </CardActionArea>
                </Card>
            </Grid>
        );
    };

    if (searchTerm) {
        cards =
            searchData &&
            searchData.map((event) => {
                return buildCard(event);
            });
    } else {
        cards =
            eventsData &&
            eventsData.map((event) => {
                return buildCard(event);
            });
    }
    
   
    if (hasCurrentPage) {
        return (
            
            <div>
                <br />
                <Search searchValue={searchValue} />
                <br />
                <br />
                {prevPage >= 0 ? (
                    <Link className='prevnextlink' to={`/events/page/${prevPage}`}>&lt;Prev</Link>
                ) : (
                    <Link className='disableprevnextlink' >&lt;Prev</Link>
                )}

                
                <Link className='prevnextlink' to={`/events/page/${nextPage}`}>Next&gt;</Link>
               
                <br />
                <br />
                <Grid
                    container
                    spacing={2}
                    sx={{
                        flexGrow: 1,
                        flexDirection: 'row'
                    }}
                >
                    {cards}
                </Grid>
            </div>
        )
    } else {
        return (
            <h1>404, the Page does not contain any more events in the list. Or you are making too many request, please slow down</h1>
        )
    }


}


export default EventList;