const crypto = require('crypto')
const { RESTDataSource } = require('apollo-datasource-rest');

const Constants = require('../constants/constants');

let hash = crypto.createHash('md5').update('some_string').digest("hex")

class HeroAPI extends RESTDataSource {
    constructor() {
      super();
      this.baseURL = `${Constants.MARVEL_HOST}`;
    }
    async getAllHeroes() {
        const ts = new Date().getTime();
        const limit = 100;
        const tsAndKeyString = ts + Constants.MARVEL_PRIVATE_API_KEY + Constants.MARVEL_PUBLIC_API_KEY;
        const tsAndKeyHash = crypto.createHash('md5').update(tsAndKeyString).digest("hex")
        console.log(tsAndKeyHash);

        const response = await this.get(Constants.MARVEL_CHARACTERS_URI,
            {
                ts: ts,
                limit: limit,
                apikey: Constants.MARVEL_PUBLIC_API_KEY,
                hash: tsAndKeyHash
            }
        );

        return Array.isArray(response.data.results)
          ? response.data.results.map(hero => this.heroReducer(hero))
          : [];
      }

      async getHeroById({ heroId }) {
        const ts = new Date().getTime();
        const limit = 100;
        const tsAndKeyString = ts + Constants.MARVEL_PRIVATE_API_KEY + Constants.MARVEL_PUBLIC_API_KEY;
        const tsAndKeyHash = crypto.createHash('md5').update(tsAndKeyString).digest("hex")
        console.log('Hero ID: ', heroId)
        const response = await this.get(`${Constants.MARVEL_CHARACTERS_URI}/${heroId}`,
            {
                ts: ts,
                limit: limit,
                apikey: Constants.MARVEL_PUBLIC_API_KEY,
                hash: tsAndKeyHash,
            }
        );
        console.log(response.data.results);
        return Array.isArray(response.data.results)
        ? this.heroReducer(response.data.results[0])
        : {}
      }
      
      getHeroByIds({ heroIds }) {
        return Promise.all(
            heroIds.map(heroId => this.getHeroById({ heroId })),
        );
      }

      async getHeroByNameStartsWith({ name }) {
          //nameStartsWith=Iron&
          const ts = new Date().getTime();
        const limit = 100;
        const tsAndKeyString = ts + Constants.MARVEL_PRIVATE_API_KEY + Constants.MARVEL_PUBLIC_API_KEY;
        const tsAndKeyHash = crypto.createHash('md5').update(tsAndKeyString).digest("hex")
        const response = await this.get(Constants.MARVEL_CHARACTERS_URI,
            {
                ts: ts,
                limit: limit,
                apikey: Constants.MARVEL_PUBLIC_API_KEY,
                hash: tsAndKeyHash,
                nameStartsWith: name
            }
        );

        return Array.isArray(response.data.results)
        ? response.data.results.map(hero => this.heroReducer(hero))
        : [];
      }





    heroReducer(hero){
        const myHero = {
            id: hero.id,
            name: hero.name,
            description: hero.description,
            thumbnail: {
                path: hero.thumbnail.path,
                extension: hero.thumbnail.extension
            },
            resourceURI: hero.resourceURI,
            comics: {
                available: hero.comics.available,
                items: []
            },
        }

        hero.comics.items.forEach(item => {
            const newItem = {
                resourceURI: item.resourceURI,
                name: item.name
            }
            myHero.comics.items.push(newItem)
        })

        return myHero
    }

  }

  module.exports =  HeroAPI;