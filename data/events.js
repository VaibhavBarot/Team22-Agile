const { ObjectId } = require('mongodb');
const {events,reviews, ratings,reports} = require('../config/mongocollections');
const path = require('path'); 
const fs = require('fs');
const multer = require('multer');
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

const createEvent = async (name, email, date, time, venue, host, description, price, eventPicture) => {
  name = name.trim();
  venue = venue.trim();
  host = host.trim();
  description = description.trim();

  const eventCollection = await events();

  let newEvent = {
      name: name,
      eventPicture: "", // Initialize eventPicture property
      email: email,
      date: date,
      time: time,
      venue: venue,
      host: host,
      description: description,
      price: price
  };

  if (eventPicture && eventPicture.mimetype.startsWith('image/')) {
      const fileBuffer = eventPicture.buffer;
      const fileName = `event-pic-${Date.now()}.png`;
      const filePath = path.join(__dirname, '../public/uploads/events/', fileName);

      fs.writeFileSync(filePath, fileBuffer);

      newEvent.eventPicture = `/uploads/events/${fileName}`;
  }

  const insertInfo = await eventCollection.insertOne(newEvent);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw 'Error: Could not add event';
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

const getAllHostedEvents = async (email) => {
  const eventCollection = await events();
  const eventList = await eventCollection.find({email:email}).toArray();


  if (!getAllHostedEvents) throw 'Could not get hosted events';
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


const createReport = async(reporterEmailID, reportedEmailId, comment) => {
  const reportCollection = await reports();
  try {
    
    let reportObj ={
      _id: new ObjectId(),
      reporterEmailID: reporterEmailID,
      reportedEmailId: reportedEmailId,
      comment: comment
    }

    const report = await reportCollection.insertOne(reportObj)
    if (!report.acknowledged || !report.insertedId){
      throw 'Error : Could not add report';
    }
    return reportObj
  } catch (error) {
    return error;
  }
}

const getreviewsbyId = async(id) => {

  if (!id) throw 'You must provide an id to search for';
  if (typeof id !== 'string') throw 'Id must be a string';
  if (id.trim().length === 0)
    throw 'Id cannot be an empty string or just spaces';
  const reviewCollection = await reviews();
  const eventReviews = await reviewCollection.find({eventId: id}).toArray();
  if (eventReviews === null) throw 'No Reviews with that id';

  return eventReviews;
};

const getRatingById = async(id) => {

  if (!id) throw 'You must provide an id to search for';
  if (typeof id !== 'string') throw 'Id must be a string';
  if (id.trim().length === 0)
    throw 'Id cannot be an empty string or just spaces';
  const ratingCollection = await ratings();
  let eventRatin = await ratingCollection.findOne({eventId: id});
  if (eventRatin === null) {
    eventRatin ="";
  }

  return eventRatin;
};

const getreviewbyId = async(id) => {

  if (!id) throw 'You must provide an id to search for';
  if (typeof id !== 'string') throw 'Id must be a string';
  if (id.trim().length === 0)
    throw 'Id cannot be an empty string or just spaces';
  const reviewCollection = await reviews();
  const eventReviews = await reviewCollection.findOne({_id: new ObjectId(id)});
  if (eventReviews === null) throw 'No Reviews with that id';

  return eventReviews;
};


const deleteReviewbyId  = async(id) => {
  const reviewCollection = await reviews();
  try {
     const eventReviews = await reviewCollection.deleteOne({"_id": new ObjectId(id)});
 } catch (e) {
    print(e);
 }
  
};

  module.exports={
    createEvent,
    getAllEvents,
    getEventbyId,
    requestEvent,
    getAllHostedEvents,
    getreviewsbyId,
    getreviewbyId,
    deleteReviewbyId,
    getRatingById,
    createReport
    
}