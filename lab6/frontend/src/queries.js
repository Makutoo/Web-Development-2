import { gql } from "@apollo/client";

const getCharactersByPage = gql`
    query getCharactersByPage($pageNum: Int!) {
        characters(pageNum: $pageNum) {
            id
            description
            image 
            modified
            name
        }
    }
`

const getCharacterById = gql`
    query getCharacterById($id: ID!) {
        character(id: $id) {
            description
            id
            image
            modified
            name
        }
    }
`

const searchCharactersByTerm = gql`
    query SearchCharacters($term: String!) {
        searchCharacters(term: $term) {
            description
            id
            image
            modified
            name
        }
    }
`

const exported = {
    getCharactersByPage,
    getCharacterById,
    searchCharactersByTerm
  };
  
export default exported;

