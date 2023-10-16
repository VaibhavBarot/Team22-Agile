import { MongoClient } from "mongodb";

const uri =
    "mongodb+srv://learnlocally:<password>@learnlocally.ywir5au.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

export const connect = async () => {
    await client.connect();

    const dbName = 'Learnlocally';
    const collectionName = 'users';

    const data = client.db(dbName);
    const collection = data.collection(collectionName);
    const result = await collection.find({}).toArray();
    return result;
}
