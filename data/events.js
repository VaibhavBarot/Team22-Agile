const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongocollections');
const events = mongoCollections.events


const createEvent = async (name, date, time, venue, host, description) => {

    name = name.trim();
    venue = venue.trim()
    host = host.trim()
    description = description.trim()

    const eventCollection = await events();

    let newEvent ={
      name:name,
      date:date,
      time:time,
      venue:venue,
      host:host,
      description:description
    }

    const insertInfo = await eventCollection.insertOne(newEvent);
      if (!insertInfo.acknowledged || !insertInfo.insertedId){
        throw 'Error : Could not add event';
      }

    return newEvent;
  };

  module.exports={
    createEvent
}