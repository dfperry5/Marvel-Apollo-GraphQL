

module.exports = {
    Query: {
      heroes: (_, __, { dataSources }) =>
        dataSources.heroAPI.getAllHeroes(),
      hero: (_, { id }, { dataSources }) =>
        dataSources.heroAPI.getHeroById({ heroId: id }),
      heroNameStartsWith: (_, { nameStartsWith }, { dataSources }) =>
        dataSources.heroAPI.getHeroByNameStartsWith({ name: nameStartsWith }),
    }
  };