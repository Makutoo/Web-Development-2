import axios from 'axios';
import React, {useState, useEffect } from "react";
import SearchForm from './SearchForm';
import Characters from './Characters';


export default function CharacterBySearch() {
    
    const [searchTerm, setSearchTerm] = useState("");
    const [searchData, setSearchData] = useState([]);

    const getCharactersByTerm = async (term) => {
        const GET_CHARACTERS_BY_TERM_QUERY = `
            query SearchCharacters($term: String!) {
                searchCharacters(term: $term) {
                    description
                    id
                    image
                    modified
                    name
                }
            }
        `;

        try {
            const response = await axios.post('http://localhost:4000', {
                query: GET_CHARACTERS_BY_TERM_QUERY,
                variables: { term },
            });
            console.log(response)
            return response.data.data.searchCharacters;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to fetch characters data');
        }
    }


    useEffect(() => {
        async function fetchData() {
            let searchCharacters = null
            try {
                searchCharacters = await getCharactersByTerm(searchTerm)
            } catch (e) {
                console.log(e);
                throw new Error('Failed to fetch characters data');
            }
            return searchCharacters
        }
        if (searchTerm) {
            console.log('searchTerm is set');
            fetchData().then((data) => {
                if(data) {
                    setSearchData(data)
                } else {
                    setSearchData([])
                }
            }).catch((e)=> {
                console.log(e.message);
                setSearchData([])
            })
        }
    }, [searchTerm]);

    const searchValue = async (value) => {
        setSearchTerm(value);
    };


    return (
        <div >
            <br />
            <SearchForm searchValue={searchValue} />
            <br />
            <Characters characters={searchData}/>
        </div>
    );
}