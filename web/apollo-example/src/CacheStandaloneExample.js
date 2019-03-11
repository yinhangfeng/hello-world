import React, { Component } from 'react';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { CachePersistor } from 'apollo-cache-persist';
import gql from 'graphql-tag';

const cache = new InMemoryCache({

});

const persistor = new CachePersistor({
  cache,
  storage: {
    getItem(key) {
      console.log('storage getItem', key);
      return localStorage.getItem(key);
    },
    setItem(key, data) {
      console.log('storage setItem', key, data);
      return localStorage.setItem(key, data);
    },
    removeItem(key) {
      console.log('storage removeItem', key);
      return localStorage.removeItem(key);
    },
  },
});

persistor.restore();

const HttpCacheQuery = gql`
query HttpCache($key: String!) {
  response(key: $key) {
    header
    body
  }
}
`;

// const HttpCacheQuery = gql`
// query HttpCache {
//   response {
//     header
//     body
//   }
// }
// `;

// 将 apollo cache 转为一个通用 cache
function write(key, {
  header,
  body,
}) {
  return cache.write({
    dataId: 'TEST',
    query: HttpCacheQuery,
    variables: {
      key,
    },
    result: {
      response: {
        __typename: 'Response',
        header,
        body,
      },
    },
  });
}

function read(key) {
  return cache.read({
    rootId: 'TEST',
    query: HttpCacheQuery,
    variables: {
      key,
    },
  });
}

export default class CacheStandaloneExample extends Component {
  render() {
    return (
      <div>
        <button onClick={() => {
          cache.write({
            dataId: 'ROOT_QUERY',
            query: HttpCacheQuery,
            variables: {
              key: 'http://example.com/aaa',
            },
            result: {
              response: {
                __typename: 'Response',
                header: 'aaa\nbbb',
                body: '{"a": 1, "b": 2}'
              },
            },
          });
        }}>test cache1</button>
        <button onClick={() => {
          const res = cache.read({
            query: HttpCacheQuery,
            variables: {
              key: 'http://example.com/aaa',
            },
          });
          console.log('res:', res);
        }}>test cache2</button>
        <button onClick={() => {
          for (let i = 0; i < 10; ++i) {
            write(`test_${i}`, {
              header: `h${i}`,
              body: `{"a": ${i}}`,
            });
          }
        }}>test cache3</button>
        <button onClick={() => {
          for (let i = 0; i < 10; ++i) {
            const res = read(`test_${i}`);
            console.log(res);
          }
        }}>test cache4</button>
        <button onClick={() => {
          const loop = 1000;

          console.time('cache write');
          for (let i = 0; i < loop; ++i) {
            write(`test_${i}`, {
              header: `h${i}`,
              body: `{"a": ${i}}`,
            });
          }
          console.timeEnd('cache write');

          console.time('cache read');
          for (let i = 0; i < loop; ++i) {
            const res = read(`test_${i}`);
          }
          console.timeEnd('cache read');


          console.time('local storage write');
          for (let i = 0; i < loop; ++i) {
            localStorage.setItem(`test_${i}`, JSON.stringify({
              header: `h${i}`,
              body: `{"a": ${i}}`,
            }));
          }
          console.timeEnd('local storage write');

          console.time('local storage read');
          for (let i = 0; i < loop; ++i) {
            const res = localStorage.getItem(`test_${i}`);
          }
          console.timeEnd('local storage read');
        }}>test cache5</button>
        <button onClick={() => {
          console.time('xxx');
          write('test', {
            header: 'xxx',
            body: 'xxx',
          });
          console.timeEnd('xxx');
        }}>test cache6</button>
      </div>
    );
  }
}
