const { ObjectId } = require('mongodb');
const {events} = require('../config/mongocollections');


const createEvent = async (name, email, date, time, venue, host, description) => {

    name = name.trim();
    venue = venue.trim()
    host = host.trim()
    description = description.trim()

    const eventCollection = await events();

    let newEvent ={
      name:name,
      email:email,
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

  const requestEvent = async (emailId, description) => {

    emailId = emailId.trim();
    description = description.trim()
  

    const eventCollection = await events();

    let newEventRequest ={
      emailId:emailId,
      description:description
    }

    const insertInfo = await eventCollection.insertOne(newEventRequest);
      if (!insertInfo.acknowledged || !insertInfo.insertedId){
        throw 'Error : Could not add requested event';
      }

    return newEventRequest;
  };

const getAllEvents = async () => {
  const eventCollection = await events();
  const eventList = await eventCollection.find({}).toArray();
  
  if (!eventList) throw 'Could not get all events';
  eventList.forEach(element => {
    element._id=element._id.toString();
  });
  return eventList;
};

const getEventbyId = async(id) => {
  if (!id) throw 'You must provide an id to search for';
  if (typeof id !== 'string') throw 'Id must be a string';
  if (id.trim().length === 0)
    throw 'Id cannot be an empty string or just spaces';
  id = id.trim();
  if (!ObjectId.isValid(id)) throw 'invalid object ID';
  
  const eventCollection = await events();
  const event = await eventCollection.findOne({_id: new ObjectId(id)});
  if (event === null) throw 'No event with that id';
  event._id=event._id.toString();
  return event;
};

const registerForEvent = async (id) => {

  const eventCollection = await events();
  const event = await eventCollection.findOne({_id: new ObjectId(id)});
 

  let newRegisterRequest={
    id:id,
    event : event,
    ////eventName : event.name (to get event name)
    ////eventDescription : event.description (to get event description)
    ////can do this for name, date, time, venue, host, description
    
  }
  const insertInfo = await eventCollection.insertOne(newRegisterRequest);
    if (!insertInfo.acknowledged || !insertInfo.insertedId){
      throw 'Error : Could not add user';
    }

  return newRegisterRequest;

};


  module.exports={
    createEvent,
    getAllEvents,
    getEventbyId,
    requestEvent,
    registerForEvent
}