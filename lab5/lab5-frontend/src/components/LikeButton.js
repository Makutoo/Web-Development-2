
import { useMutation } from '@apollo/client';
import { updateLocation , getUserLikedLocations} from '../queries.js';
import '../App.css';

import {
    Button
} from '@mui/material';


const LikeButton = (props) => {
    // const [deleteFunction, { data, loading, error }] = useMutation(deleteLocation)
     

    const [updateFuntion, { data, loading, error }] = useMutation(updateLocation, {
        refetchQueries: [
          {query: getUserLikedLocations}
        ],
      });
    const loc = props.loc
    return (
        <Button onClick={() => {

            updateFuntion({
                variables: {
                    updateLocationId: loc.id,
                    liked: !loc.like,
                    image: loc.image,
                    address: loc.address,
                    userPosted: loc.userPosted,
                    name: loc.name
                }
            })
            
        }} variant="outlined" > {loc && loc.liked ? "Remove Like" : "Like"} </Button>
    )
}

export default LikeButton;