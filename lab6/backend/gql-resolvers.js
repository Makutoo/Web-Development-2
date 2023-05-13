const { createClient } = require("redis");
const axios = require("axios");
const md5 = require("blueimp-md5");


const redisClient = createClient();
(async () => {
    await redisClient.connect();
})();




module.exports = {
    Query: {
        characters: async (_, args) => {
            let { pageNum } = args
            pageNum = pageNum.toString()
            
            /* if is in cache */
            if (await redisClient.hExists("characters", pageNum)) {
                let characters = JSON.parse(await redisClient.hGet("characters", pageNum));
                return characters
            }
            
            const publickey = '78e207cda5533f2d727403d65052d721';
            const privatekey = '3eab353335cd6c75b55daaeffe25b30c9e6cbbe7';
            const ts = new Date().getTime();
            const stringToHash = ts + privatekey + publickey;
            const hash = md5(stringToHash);
            const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
            const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash + '&offset=' + (pageNum * 20)
            let response = await axios.get(url);
            const { data } = response
            const { results } = data.data
            if (results.length == 0) {
                const error = new Error('Page does not contain any more Characters');
                error.statusCode = 404;
                throw error;
            }
            const characters = []
            for (const result of results) {
                const character = {}
                character.id = result.id
                character.name = result.name
                character.image = result.thumbnail.path + '.' + result.thumbnail.extension
                character.description = result.description
                characters.push(character)
            }

            /* add to cache */
            await redisClient.hSet("characters", pageNum, JSON.stringify(characters));
            return characters
        },

        character: async (_, args) => {
            let { id } = args
            id = id.toString()

            /* if is in cache */
            if (await redisClient.hExists("character", id)) {
                let character = JSON.parse(await redisClient.hGet("character", id));
                return character
            }
            
            const publickey = '78e207cda5533f2d727403d65052d721';
            const privatekey = '3eab353335cd6c75b55daaeffe25b30c9e6cbbe7';
            const ts = new Date().getTime();
            const stringToHash = ts + privatekey + publickey;
            const hash = md5(stringToHash);
            const baseUrl = `https://gateway.marvel.com:443/v1/public/characters/${id}`;
            const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash
            const { data } = await axios.get(url)
            const { results } = data.data
            const result = results[0]
            const character = {}
            character.id = result.id
            character.name = result.name
            character.image = result.thumbnail.path + '.' + result.thumbnail.extension
            character.description = result.description

            /* add to cache */
            await redisClient.hSet("character", id, JSON.stringify(character));
            return character
        },

        searchCharacters: async (_, args) => {
            let { term } = args
            term = term.toString()
            
            /* if is in cache */
            if (await redisClient.hExists("search", term)) {
                let characters = JSON.parse(await redisClient.hGet("search", term));
                return characters
            }

            const publickey = '78e207cda5533f2d727403d65052d721';
            const privatekey = '3eab353335cd6c75b55daaeffe25b30c9e6cbbe7';
            const ts = new Date().getTime();
            const stringToHash = ts + privatekey + publickey;
            const hash = md5(stringToHash);
            const baseUrl = `https://gateway.marvel.com:443/v1/public/characters`;
            const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash + '&nameStartsWith=' + term 
            let response = await axios.get(url);
            
            const { data } = response
            const { results } = data.data
            if (results.length == 0) {
                const error = new Error('Page does not contain any Characters');
                error.statusCode = 404;
                throw error;
            }
            const characters = []
            for (const result of results) {
                const character = {}
                character.id = result.id
                character.name = result.name
                character.image = result.thumbnail.path + '.' + result.thumbnail.extension
                character.description = result.description
                characters.push(character)
            }

            await redisClient.hSet("search", term, JSON.stringify(characters));
            return characters
        }

    }
}