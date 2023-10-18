const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongocollections');
const events = mongoCollections.events


const createEvent = async (date, firstName, lastName, title, description) => {

    lastName = lastName.trim();
    firstName = firstName.trim();
    description = description.trim()
    title = title.trim()

    const eventCollection = await events();

    let newEvent ={
      firstName:firstName,
      lastName:lastName,
      date:date,
      title:title,
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