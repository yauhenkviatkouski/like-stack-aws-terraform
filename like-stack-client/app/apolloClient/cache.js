import { InMemoryCache } from '@apollo/client';

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        loggedUser: {
          read() {
            return loggedUserCacheVar();
          },
        },
      },
    },
  },
});

export const loggedUserCacheVar = cache.makeVar(null);
