import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { addLocation, getUserPostedLocations} from '../queries.js';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));


function isImageURL(url) {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "svg", "bmp"]; // array of image extensions to check against
    const extension = url.split(".").pop().toLowerCase(); // get the file extension from the URL and convert to lowercase
    return imageExtensions.includes(extension); // check if the extension is in the array of image extensions
}

function PostForm() {
  const classes = useStyles();

  const [imageURL, setImageURL] = useState('');
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');

  const [addFunction, { data, loading, error }] = useMutation(addLocation, {
    refetchQueries: [
      {query: getUserPostedLocations}
    ],
  });

  
  const handleSubmit = (event) => {
    event.preventDefault();
    if(isImageURL(imageURL)) {
        addFunction({
            variables: {
                image: imageURL,
                name: locationName,
                address: address
            }
        })
        alert('New Location Post Added');
    } else {
        alert('The url is incorrect, please fill in the right image url');
        alert('should contain "jpg", "jpeg", "png", "gif", "svg", "bmp"')
    }
    
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <div>
        <TextField
          required
          label="Image URL"
          value={imageURL}
          onChange={(event) => setImageURL(event.target.value)}
        />
      </div>
      <div>
        <TextField
          required
          label="Location Name"
          value={locationName}
          onChange={(event) => setLocationName(event.target.value)}
        />
      </div>
      <div>
        <TextField
          required
          label="Address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
      </div>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
}

export default PostForm;