const dbConnection = require('./mongoconnection');

const getCollectionFn = (collection) => {
  let col = undefined;

  return async () => {
    if (!col) {
      const db = await dbConnection.dbConnection();
      col = await db.collection(collection);
    }

    return col;
  };
};


module.exports = {
  users: getCollectionFn('users'),
  events: getCollectionFn('events'),
  reviews: getCollectionFn('reviews'),
  ratings: getCollectionFn('ratings')
};
