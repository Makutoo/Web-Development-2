import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import noImage from '../img/download.jpeg';
import '../App.css';
import {
    makeStyles,
    Card,
    CardContent,
    CardMedia,
    Typography,
    CardHeader,
} from '@material-ui/core';

const useStyles = makeStyles({
    card: {
        maxWidth: 750,
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
});

const Venue = (props) => {
    const [eventData, setEventData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [hasEventData, setHasEventData] = useState(false)
    const classes = useStyles();
    let { id } = useParams();

    const getUsefulData = (data) => {
        const name = data.name
        const type = data.type
        const id = data.id
        const url = data.url
        const locale = data.locale
        const postalCode = data.postalCode
        const timezone = data.timezone
        const image = (data.images && data.images[0]) ? data.images[0].url : undefined
        const boxOfficeInfo = data.boxOfficeInfo ? data.boxOfficeInfo : undefined
        
       
        
        return {
            name: name,
            url: url,
            image: image,
            locale: locale,
            type: type,
            id: id,
            postalCode: postalCode,
            timezone: timezone,
            boxOfficeInfo: boxOfficeInfo
        }
    }
    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(
                    
                     `https://app.ticketmaster.com/discovery/v2/venues/${id}?apikey=GgAnU4sOLLqCdeo6o2HaCUZCMfj4neRM`
                );
                const event = getUsefulData(data)
                setEventData(event);
                setLoading(false);
                setHasEventData(true)
            } catch (e) {
                setLoading(false);
                console.log(e);
            }
        }
        fetchData();
    }, [id]);

   

    if (loading) {
        return (
            <div>
                <h2>Loading....</h2>
            </div>
        );
    } else if(!hasEventData) {
        return (
            <div>
                <h2>404, the Venue does not exist. Or you are making too many request, please slow down</h2>
            </div>
        )
    } else {
        return (
            <Card key={eventData.id} className={classes.card} variant='outlined'>
                <CardHeader className={classes.titleHead} title={eventData.name} />
                <CardMedia
                    className={classes.media}
                    component='img'
                    image={
                        eventData && eventData.image
                            ? eventData.image
                            : noImage
                    }
                    title='event image'
                />

                <CardContent>
                    <Typography variant='body2' color='textSecondary' component='span'>
                        <dl>
                            <p>
                                <dt className='title'>Venue Name:</dt>
                                {eventData && eventData.name ? (
                                    <dd>{eventData.name}</dd>
                                ) : (
                                    <dd>N/A</dd>
                                )}
                            </p>
                            <p>
                                <dt className='title'>Offical Site:</dt>
                                {eventData && eventData.url ? (
                                    <dd>
                                        <a
                                            rel='noopener noreferrer'
                                            target='_blank'
                                            href={eventData.url}
                                        >
                                            {eventData.name} Offical Site
                                        </a>
                                    </dd>
                                ) : (
                                    <dd>N/A</dd>
                                )}
                            </p>
                            <p>
                                <dt className='title'>locale:</dt>
                                {eventData && eventData.locale && eventData.locale ? (
                                    <dd>{eventData.locale}</dd>
                                ) : (
                                    <dd>N/A</dd>
                                )}
                            </p>
                            
                            <p>
                                <dt className='title'>type:</dt>
                                {eventData && eventData.type ? (
                                    <dd>{eventData.type}</dd>
                                ) : (
                                    <dd>N/A</dd>
                                )}
                            </p>

                            <p>
                                <dt className='title'>id:</dt>
                                {eventData && eventData.id ? (
                                    <dd>{eventData.id}</dd>
                                ) : (
                                    <dd>N/A</dd>
                                )}
                            </p>
                            <p>
                                <dt className='title'>timezone:</dt>
                                {eventData && eventData.timezone ? (
                                    <dd>{eventData.timezone}</dd>
                                ) : (
                                    <dd>N/A</dd>
                                )}
                            </p>
                            <p>
                                <dt className='title'>postalCode:</dt>
                                {eventData && eventData.postalCode ? (
                                    <dd>{eventData.postalCode}</dd>
                                ) : (
                                    <dd>N/A</dd>
                                )}
                            </p>
                            <p>
                                <dt className='title'>acceptedPaymentDetail:</dt>
                                {eventData && eventData.boxOfficeInfo && eventData.boxOfficeInfo.acceptedPaymentDetail ? (
                                    <dd>{eventData.boxOfficeInfo.acceptedPaymentDetail}</dd>
                                ) : (
                                    <dd>N/A</dd>
                                )}
                            </p>
                            <p>
                                <dt className='title'>willCallDetail:</dt>
                                {eventData && eventData.boxOfficeInfo && eventData.boxOfficeInfo.willCallDetail ? (
                                    <dd>{eventData.boxOfficeInfo.willCallDetail}</dd>
                                ) : (
                                    <dd>N/A</dd>
                                )}
                            </p>
                        </dl>
                        <Link to='/events/venues/0'>Back to first Venues page...</Link>
                    </Typography>
                </CardContent>
            </Card>
        );
    }
};

export default Venue;
