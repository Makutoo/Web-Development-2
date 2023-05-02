const { createClient } = require("redis");
const axios = require("axios");
const { v4: uuid } = require("uuid");

const redisClient = createClient();
(async () => {
  await redisClient.connect();
})();


let FOURSQUARE_API = "https://api.foursquare.com/v3/places/search?limit=24"
const first_FOURSQUARE_API = FOURSQUARE_API
const APIKEY = "fsq3xFBXoF6GBSGq8mDP/J9dJ3NJKNSJ6P8xjn+/GS195U8="
const config = {
    headers:{
        Authorization: APIKEY
    }
}


async function getImgUrl(fsq_id){
  const {data} = await axios.get(`https://api.foursquare.com/v3/places/${fsq_id}/photos`, config)

  if(data[0] === undefined) {
    return ""
  }
  const urlPrefix = data[0].prefix
  const urlSuffix = data[0].suffix
  const photoUrl = urlPrefix + "original" + urlSuffix
  // console.log(photoUrl)
  return photoUrl
}

module.exports = {
  Query: {
    locationPosts: async (_, args) => {
      const { pageNum } = args;

      const response = await axios.get(FOURSQUARE_API, config)
      // console.log(response.headers['link'])
      // const link = response.headers['link'].split(";")[0]
      // const nextUrl = link.substring(1, link.length-1)
      // FOURSQUARE_API = nextUrl
      if(response.headers['link'] !== undefined) {
        const link = response.headers['link'].split(";")[0]
        const nextUrl = link.substring(1, link.length-1)
        FOURSQUARE_API = nextUrl
      } else {
        
        FOURSQUARE_API = first_FOURSQUARE_API
        return []
      }
    
      console.log(FOURSQUARE_API)
      const data = response.data.results;

      const locations = [];
      for (const location of data) {
        loc = {};
        loc.id = location.fsq_id;
        loc.image = getImgUrl(location.fsq_id);
        loc.name = location.name;
        loc.address = location.location.address;
        loc.userPosted = false;
        if (await redisClient.hExists("likes", loc.id)) { // if the location is from Place Api, and user liked it
          loc.liked = true;
        } else {
          loc.liked = false;
        }
        locations.push(loc);
      }
      return locations;
    },
    visitedLocations: async () => {
      const data = await redisClient.hVals("likes");
      const locations = [];
      for (const val of data) {
        const loc = JSON.parse(val);
        if (loc.liked === true) {
            locations.push(loc);
        }
      }
      return locations;
    },
    userPostedLocations: async () => {
      const data = await redisClient.hVals("locations");
      const locations = [];
      for (const val of data) {
        const loc = JSON.parse(val);
        if (loc.userPosted === true) {
            locations.push(loc);
        }
      }
      return locations;
    },
  },

  Mutation: {
    uploadLocation: async (_, args) => {
      const { image, address, name } = args;
      const id = uuid();
      const location = {
        id,
        image,
        address,
        name,
        userPosted: true,
        liked: false,
        
      };
      await redisClient.hSet("locations", id, JSON.stringify(location));
      return location;
    },
    updateLocation: async (_, args) => {
      let { id, image, name, address, userPosted, liked } = args;
      if (await redisClient.hExists("likes", id)) {
        let oldLocation = JSON.parse(await redisClient.hGet("likes", id));
        oldLocation.liked = false
        await redisClient.hDel("likes", id);
        return oldLocation
      } else {
        const location = {
            id,
            image,
            name,
            address,
            userPosted,
            liked,
        };
        await redisClient.hSet("likes", id, JSON.stringify(location));
        return location
      }
      
    },
    deleteLocation: async (_, args) => {
      const { id } = args;
      let location = await redisClient.hGet("locations", id);
      location = JSON.parse(location);
      await redisClient.hDel("locations", id);
      if(await redisClient.hExists("likes", id)) {
        await redisClient.hDel("likes", id)
      }
      return location;
    },
  },
};
