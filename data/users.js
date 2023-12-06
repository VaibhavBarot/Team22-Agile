const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongocollections');
const users = mongoCollections.users
const reviews = mongoCollections.reviews
const ratings = mongoCollections.ratings
const bcrypt = require('bcryptjs');
const validation = require('../helper')

const createUser = async ( emailId, password, firstName, lastName, city) => {

  emailId = emailId.trim().toLowerCase();
  password = password.trim();

  
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

  firstName = await validation.checkName(firstName, "First Name");
  lastName = await validation.checkName(lastName, "Last Name");
  city = await validation.checkName(city, "City");
  const userCollection = await users();

  const existingUser = await userCollection.findOne({ emailId: emailId });
  if (existingUser) {
    throw 'User with that email already exists';
  }

  const saltRounds = 10;
  let hash = await bcrypt.hash(password, saltRounds);
  
  let newUser={
    emailId:emailId,
    password:hash,
    firstName:firstName,
    lastName:lastName,
    city: city, 
    bio: "",  
    profilePicture: ""

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
  if(!user){
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


  const postMessage = async (from,to,description) => {

    to = to.trim()
    from = from.trim()
    description = description.trim()

    let newEvent ={
      email:from,
      description:description
    }
    const userCollection = await users();
    const user = await userCollection.findOne({
      emailId: to
    });
    if(user===null){
      throw "Invalid Email";
    }

    const messages = (user.messages) ? user.messages : [];
    messages.push(newEvent)
    const insertInfo = await userCollection.updateOne(
      {emailId:to},
      {
      $set:{
        messages:messages
      }
    });
      if (!insertInfo.acknowledged){
        throw 'Error : Could not send message';
      }

    return newEvent;
  };

  const retrieveMessages = async (email) => {

    email = email.trim()

    const userCollection = await users();
    const user = await userCollection.findOne({
      emailId: email
    });
    if(user===null){
      throw "Invalid Email";
    }

    return user.messages;
  };

  const readMessages = async (email) => {

    email = email.trim()

    const userCollection = await users();
    const user = await userCollection.findOne({
      emailId: email
    });
    if(user===null){
      throw "Invalid Email";
    }
    await userCollection.updateOne({emailId:email},{
      $unset:{messages:1}
    })

    return user.messages;
  };


  const submitReview = async (from,title,description,eventId,rId) => {
      
    title = title.trim();
    from = from.trim();
    description = description.trim();

    if(!title){
      throw "Please enter title";
    }
    if(!description){
      throw "Please enter comment";
    }
    let subReview ={
      eventId:eventId,
      email:from,
      title:title,
      description:description
    }

    const userCollection = await users();
    const user = await userCollection.findOne({
      emailId: from
    });
    if(user===null){
      throw "Invalid Email";
    }
    const reviewCollection = await reviews();
    //const insertInfo;
    if(rId){
      insertInfo = await reviewCollection.updateOne({"_id": new ObjectId(rId)}, {$set: {"title":title,"description":description}});
    } else {
      insertInfo = await reviewCollection.insertOne(subReview);
    }
    
    
      if (!insertInfo.acknowledged){
        throw 'Error : Could not send message';
      }

    return subReview;
  };



  const submitRating = async (from,rid,eventId) => {
      
    rid = rid.trim();
    from = from.trim();
    eventId = eventId.trim();
  

    let subRate ={
      eventId:eventId,
      email:from,
      rid:rid,
     }

    const userCollection = await users();
    const user = await userCollection.findOne({
      emailId: from
    });
    if(user===null){
      throw "Invalid Email";
    }
    const rateCollection = await ratings();
    const messages = (user.messages) ? user.messages : [];
    messages.push(subRate)
    const insertInfo = await rateCollection.insertOne(subRate,
      {
      $set:{
        messages:messages
      }
    });
      if (!insertInfo.acknowledged){
        throw 'Error : Could not send message';
      }

    return subRate;
  };


module.exports={
  login,
  createUser,
  registerForEvent,
  registeredEvents,
  unregisterForEvent,
  postMessage,
  retrieveMessages,
  readMessages,
  submitReview,
  submitRating
}