const { ObjectId } = require('mongodb');
const {events} = require('../config/mongocollections');
const {reports} = require('../config/mongocollections')

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

const createReport = async(reporterID, reportedUserId, comment) => {
  const reportCollection = await reports();
  try {
    console.log("Information about the report");
    console.log(reporterID);
    console.log(reportedUserId);
    console.log(comment);

    
    //return "Done from event data file"
    let reportObj ={
      _id: new ObjectId(),
      reporterID: reporterID,
      reportedUserId: reportedUserId,
      comment: comment
    }

    console.log("reporter obj");
    console.log(reportObj);
    const report = await reportCollection.insertOne(reportObj)
    if (!report.acknowledged || !report.insertedId){
      throw 'Error : Could not add report';
    }
    return reportObj
  } catch (error) {
    return error;
  }
}



  module.exports={
    createEvent,
    getAllEvents,
    getEventbyId,
    requestEvent,
    createReport
}