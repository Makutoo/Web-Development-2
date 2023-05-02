import { useMutation } from '@apollo/client';
import { deleteLocation, getUserPostedLocations, getUserLikedLocations } from '../queries.js';
import '../App.css';

import {
    Button
} from '@mui/material';

const DeleteButton = (props) => {
    // const [deleteFunction, { data, loading, error }] = useMutation(deleteLocation)
     

    const [deleteFunction, { data, loading, error }] = useMutation(deleteLocation, {
        refetchQueries: [
          {query: getUserPostedLocations},
          {query: getUserLikedLocations}
        ],
      });
    console.log(props.id)
    return (
        <Button onClick={() => {
            deleteFunction({
                variables: {
                    deleteLocationId: props.id
                }
            })
            alert('Location Deleted');
        }} variant="outlined" > DELETE </Button>
    )
}

export default DeleteButton;