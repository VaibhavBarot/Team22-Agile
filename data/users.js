const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongocollections');
const users = mongoCollections.users
const bcrypt = require('bcryptjs');

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

const createUser = async (emailId, password, firstName, lastName) => {

    emailId = emailId.trim().toLowerCase();
    password = password.trim();
    firstName = firstName.trim();
    lastName = lastName.trim();

    const userCollection = await users();
    const user = await userCollection.findOne({
      emailId: emailId
    });

    if(user!=null){
      if(user.emailId.toLowerCase()===emailId){
        throw "user with that email already exists";
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

module.exports={
    login,
    createUser
}