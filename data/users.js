const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongocollections');
const users = mongoCollections.users
const bcrypt = require('bcryptjs');

const createUser = async (emailId, password, firstName, lastName) => {

  emailId = emailId.trim().toLowerCase();
  password = password.trim();
  firstName = firstName.trim();
  lastName = lastName.trim();

  if (!emailId || !password) 
    throw `Email or Password cannot be empty`;
  if (typeof emailId != "string") 
    throw `Email needs to be a string`;
  let myemailId = emailId.split(" ")
  if (myemailId.length > 1) 
    throw  `EmailId cannot have spaces`;
  if (!(/^[a-zA-Z]+[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/).test(emailId)) 
    throw  `Invalid email address`;
  if (emailId.length < 4) 
    throw `Email must be at least 4 characters long`;

  if (typeof password != "string") 
    throw `Password needs to be a string`;
  let myPassword = password.split(" ")
  if (myPassword.length > 1) 
    throw  `Password cannot have spaces`;
  if (!(/^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/).test(password))
    throw "Password must contain at least 8 characters, One uppercase letter, One special charcter and One number"

  if (!firstName) throw 'You must provide a firstName';
  if (typeof firstName !== 'string') throw 'firstName must be a string';
  if (firstName.trim().length === 0)
    throw 'firstName cannot be an empty string or string with just spaces';
  if (!(/^[A-Za-z]{3,}$/).test(firstName))
    throw 'First Name must not have numbers, special characters, punctuations and length of First Name must be at least 3 ';

  if (!lastName) throw 'You must provide a lastName';
  if (typeof lastName !== 'string') throw 'lastName must be a string';
  if (lastName.trim().length === 0)
    throw 'lastName cannot be an empty string or string with just spaces';
  if (!(/^[A-Za-z]{3,}$/).test(lastName))
    throw 'Last Name must not have numbers, special characters, punctuations and length of Last Name must be at least 3 ';

  const userCollection = await users();
  const user = await userCollection.findOne({
    emailId: emailId
  });

  if(user!=null){
    if(user.emailId.toLowerCase()===emailId){
      throw "User with that email already exists";
    }
  }

  const saltRounds = 10;
  let hash = await bcrypt.hash(password, saltRounds);
  
  let newUser={
    emailId:emailId,
    password:hash,
    firstName:firstName,
    lastName:lastName

  }

  const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId){
      throw 'Error : Could not add user';
    }

  return newUser;
};

const login = async (emailId, password) => {

  emailId = emailId.trim().toLowerCase();
  password = password.trim();

  const userCollection = await users();
  const user = await userCollection.findOne({
    emailId: emailId
  });
  if(user===null){
    throw "Either the email or password is invalid";
  }

  let compare = await bcrypt.compare(password, user.password);
  if(!compare){
    throw "Either the email or password is invalid";
  }
  
  return user;

};

const registerForEvent = async (id, emailid, event) => {
  emailid = emailid.trim();

  
  const userCollection = await users();
  

  // let newRegisterRequest={
    
  //   eventid:id,
  //   emailid:emailid,
  //   RegisteredEvent:event
  //   ////eventName : event.name (to get event name)
  //   ////eventDescription : event.description (to get event description)
  //   ////can do this for name, date, time, venue, host, description
    
  // }
  const updateInfo = await userCollection.updateOne({emailId:emailid}, {$addToSet: {RegisteredEvents : event}});


  if (updateInfo.modifiedCount === 0){
    throw "Error: Update failed";
  }
  if (!updateInfo.acknowledged) {
    throw "Error: could not be updated";
  }


  return {update: true};


};

const registeredEvents = async (emailid) => {
  emailid = emailid.trim();

  
  const userCollection = await users();
  const user = await userCollection.findOne({
    emailId: emailid
  });

  if(user==null){
      throw "User does not exists";
  }
  return user.RegisteredEvents;
};

const unregisterForEvent = async (eventId,emailId) => {
  emailid = emailId.trim();
  eventid = eventId.trim();

  const userCollection = await users();

  const updateInfo = await userCollection.updateOne({emailId:emailid}, {$pull: {RegisteredEvents : {_id:eventid}}});


  if (updateInfo.modifiedCount === 0){
    throw "Error: Update failed";
  }
  if (!updateInfo.acknowledged) {
    throw "Error: could not be updated";
  }


  return {update: true};


};


module.exports={
  login,
  createUser,
  registerForEvent,
  registeredEvents,
  unregisterForEvent
}