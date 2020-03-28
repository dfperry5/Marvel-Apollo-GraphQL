const { gql } = require('apollo-server');

const typeDefs = gql`
    type Hero {
        id: ID!
        name: String
        description: String
        thumbnail: HeroThumbnail
        resourceURI: String
        comics: Comics
    }

    type HeroThumbnail {
        path: String
        extension: String
    }

    type Comics {
        available: Int
        items: [ComicItem]
    }
    type ComicItem {
        resourceURI: String
        name: String
    }
    type Query {
        heroes: [Hero]!
        hero(id: ID!): Hero
        heroNameStartsWith(nameStartsWith: String): [Hero]
    }
`;

module.exports = typeDefs;