import { Manager } from '@twilio/flex-ui';

/**
 * Promise wrapper for instantQuery search. Enables the caller
 * to await the search results instead of configuring callbacks
 * and query result listeners.
 * @param index instant query index to search
 * @param query query expression
 * @returns Promise of query results
 */
const instantQuerySearch = async (index, query) => {
  const instantQueryClient =
    await Manager.getInstance().insightsClient.instantQuery(index);

  const queryPromise = new Promise(resolve => {
    instantQueryClient.on('searchResult', items => {
      resolve(items);
    });
  });

  await instantQueryClient.search(query);
  return queryPromise;
};

export default instantQuerySearch;
