import React from 'react';
import { render } from 'react-dom';

import ApolloClient from 'apollo-boost';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  fetchOptions: {
    headers: {
      xxx: 1,
    },
  },
  request: (operation) => {
    console.log('ApolloClient request', operation);
    return operation;
  },
  onError: (error) => {
    console.log('ApolloClient onError', error);
  },
});

const ExchangeRateQuery = gql`
  query rates($currency: String!) {
    rates(currency: $currency) {
      currency
      rate
    }
  }
`;

const ExchangeRates = () => (
  <Query
    query={ExchangeRateQuery}
    variables={{ currency: 'USD' }}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return data.rates.map(({ currency, rate }) => (
        <div key={currency}>
          <p>
            {currency}: {rate}
          </p>
        </div>
      ));
    }}
  </Query>
);

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <button
        onClick={() => {
          client.query({
            query: gql`
              {
                rates(currency: "USD") {
                  currency
                }
              }
            `,
          }).then((result) => {
            console.log(result);
          }, (err) => {
            console.log(err);
          });
        }}
      >
        test1
      </button>
      <button>test2</button>
      <button>test3</button>
      <button>test4</button>
      <button>test5</button>
      <ExchangeRates />
    </div>
  </ApolloProvider>
);

render(<App />, document.getElementById('root'));
