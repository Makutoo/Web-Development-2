import { gql } from '@apollo/client'

export const getPlacesAPILocations = gql`
    query {
        locationPosts {
            id
            image
            liked
            name
            userPosted
            address
        }
    }
`
export const getUserPostedLocations = gql`
    query {
        userPostedLocations {
            id
            address
            image
            liked
            name
            userPosted
        }
    }
`
export const getUserLikedLocations = gql`
    query {
        visitedLocations {
            id
            image
            name
            address
            userPosted
            liked
        }
    }
`

export const addLocation = gql`
    mutation addLocation($image: String!, $address: String!, $name: String!) {
        uploadLocation(image: $image, address: $address, name: $name) {
            id
            address
            image
            liked
            name
            userPosted
        }
    }
`;

export const updateLocation = gql`
    mutation UpdateLocation($updateLocationId: ID!, $name: String, $liked: Boolean, $image: String, $address: String, $userPosted: Boolean) {
        updateLocation(id: $updateLocationId, name: $name, liked: $liked, image: $image, address: $address, userPosted: $userPosted) {
            id
            image
            name
            address
            userPosted
            liked
        }
    }
`

export const deleteLocation = gql`
    mutation DeleteLocation($deleteLocationId: ID!) {
        deleteLocation(id: $deleteLocationId) {
            id
            image
            name
            address
            userPosted
            liked
        }
    }
`


