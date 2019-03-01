const { ApolloServer, gql } = require('apollo-server');
const fetch = require('node-fetch');
const _ = require('lodash');

// Construct a schema, using GraphQL schema language
const typeDefs = `
  type Query {
    rates(currency: String!): [ExchangeRate]
  }

	type ExchangeRate {
		currency: String
		rate: String
		name: String
	}
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    rates: async (root, { currency }) => {
      console.log('Query rates', root);
      try {
        const results = await fetch(
          `https://api.coinbase.com/v2/exchange-rates?currency=${currency}`
        );
        const exchangeRates = await results.json();

        return _.map(exchangeRates.data.rates, (rate, currency) => ({
          currency,
          rate,
        }));
      } catch (e) {
        console.error(e);
      }
    },
  },
  ExchangeRate: {
    name: async ({ currency }) => {
      console.log('ExchangeRate name');
      try {
        const results = await fetch('https://api.coinbase.com/v2/currencies');
        const currencyData = await results.json();

        const currencyInfo = currencyData.data.find(c => c.id.toUpperCase() === currency);
        return currencyInfo ? currencyInfo.name : null;
      } catch (e) {
        console.error(e);
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
