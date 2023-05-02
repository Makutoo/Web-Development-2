
import noImage from '../img/download.jpeg';
import { useQuery } from '@apollo/client';
import DeleteButton from './DeleteButton';
import LikeButton from './LikeButton';
import NextButton from './NextButton';
import { getPlacesAPILocations, getUserLikedLocations, getUserPostedLocations } from '../queries.js';
import '../App.css';
import {
    Card,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    Button
} from '@mui/material';






const buildLocation = (loc, canDelete=false) => {
    return (
        <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={loc.id}>
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

                <CardMedia
                    sx={{
                        height: '100%',
                        width: '100%'
                    }}
                    component='img'
                    image={
                        loc && loc.image ? loc.image : noImage
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
                        {loc && loc.name ? loc.name : "Anonymous"}
                    </Typography>

                    <Typography variant='body2' color='textSecondary' component='p'>
                        {loc && loc.address ? loc.address : "N/A"}
                    </Typography>
                    
                    {/* <Button variant="outlined" >
                        {loc && loc.liked ? "Remove Like" : "Like"}
                    </Button> */}
                    <LikeButton loc={loc}/>
                    {canDelete ? <DeleteButton id={loc.id}/> : <br></br>}
                    
                  

                </CardContent>

            </Card>
        </Grid>
    );
};




    
  

const LocationsList = (props) => {
    
    

    let query = null
    let canDelete = false
    if(props.page === 'Main') {
        query = getPlacesAPILocations
    } else if(props.page === 'Liked') {
        query = getUserLikedLocations
    } else {
        query = getUserPostedLocations
        canDelete = true
    }
    const { loading, error, data } = useQuery(query)
    
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    let locations = null
    if(query === getPlacesAPILocations) {
        console.log(data.locationPosts.length)
        
        locations = data.locationPosts.map((loc) => {
            return buildLocation(loc, canDelete);
        });
        // setAllData(allData=> [...allData, ...data.locationPosts])
        // locations = allData.map((loc) => {
        //     return buildLocation(loc, canDelete);
        // });
    } else if(query === getUserLikedLocations) {
        locations = data.visitedLocations.map((loc) => {
            return buildLocation(loc, canDelete);
        });
    } else {
        locations = data.userPostedLocations.map((loc) => {
            return buildLocation(loc, canDelete);
        });
    }
    
    if(locations.length === 0) {
        if(props.page === 'Posted') {
            return (
                <h3>You don't have any post...</h3>
            )
        } else if(props.page === 'Liked') {
            return (
                <h3>You have not liked any post...</h3>
            )
        } else {
            return (
                <div>
                    <h3>End of the pages, please refresh the page to start again.</h3>
                </div>
  
            )
        }
    }else {
        return (
            <div>
                <Grid
                    container
                    spacing={2}
                    sx={{
                        flexGrow: 1,
                        flexDirection: 'row'
                    }}
                >
                    {locations}
                
                </Grid>
                <br />
                <br />
                <br />
                {props.page === 'Main'? <NextButton /> : <br></br>}
                <br />
                <br />
                <br />
            </div>
        )
    }
    
    
    
    

    

}


export default LocationsList;