const MongoClient = require('mongodb').MongoClient;
const settings = require('./settings');
const mongoConfig = settings.mongoConfig;

let connection = undefined;
let db = undefined;

module.exports = {
  dbConnection: async () => {
    if (!connection) {
      connection = await MongoClient.connect(mongoConfig.serverUrl);
      db = await connection.db(mongoConfig.database);
    }

    return db;
  },
  closeConnection: () => {
    connection.close();
  },
};


// Vaibhav
// import { MongoClient } from "mongodb";

// const uri =
//     "mongodb+srv://learnlocally:<password>@learnlocally.ywir5au.mongodb.net/?retryWrites=true&w=majority";

// const client = new MongoClient(uri);

// export const connect = async () => {
//     await client.connect();

//     const dbName = 'Learnlocally';
//     const collectionName = 'users';

//     const data = client.db(dbName);
//     const collection = data.collection(collectionName);
//     const result = await collection.find({}).toArray();
//     return result;
// }
