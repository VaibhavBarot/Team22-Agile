const connection = require("./config/mongoconnection");
const {ObjectId} = require("mongodb");
const users = require("./data/users");
const events = require("./data/events")
const fs = require('fs');

const main = async() => {
    let event1,event2,event3;
    const db = await connection.dbConnection();
    await db.dropDatabase();
    try {
        await users.createUser("user1@ll.com","Qwerty@123","usero","one","Hoboken")  
    } catch (error) {
        console.log(error)
    }
    try {
        await users.createUser("user2@ll.com","Qwerty@123","usert","two","Hoboken")  
    } catch (error) {
        console.log(error)
    }
    try {
        await users.createUser("user3@ll.com","Qwerty@123","userth","three","Hoboken")  
    } catch (error) {
        console.log(error)
    }
    try {
        await users.createUser("user4@ll.com","Qwerty@123","userf","four","Hoboken")  
    } catch (error) {
        console.log(error)
    }
    try {
        await users.createUser("user5@ll.com","Qwerty@123","userfi","five","Hoboken")  
    } catch (error) {
        console.log(error)
    }
    try {
        await users.createUser("user6@ll.com","Qwerty@123","users","six","Hoboken")  
    } catch (error) {
        console.log(error)
    }
    try {
        await users.createUser("user7@ll.com","Qwerty@123","userse","seven","Hoboken")  
    } catch (error) {
        console.log(error)
    }
    try {
        img = {};
        const promise = fs.promises.readFile('Assets/Pottery.jpeg');
        await Promise.resolve(promise).then(async function(buffer){
        img.buffer = buffer;
        let e = await events.createEvent("Laugh and Learn Pottery","user1@ll.com","2023-12-01","13:00",
        "52 Park Ave, New York, NY 10016","usero","A Fun-Filled Workshop for learning pottery",0,img)
        event1 = e._id;
});
    } catch (error) {
        console.log(error)
    }
    try {
        let img = {};
        const promise = fs.promises.readFile('Assets/Coding.jpeg');
        await Promise.resolve(promise).then(async function(buffer){
        img.buffer = buffer;
        let e = await events.createEvent("Serious Fun","user2@ll.com","2023-12-02","18:00",
        "52 Oak St, Belleville, NJ 07109","usert","A Workshop That Turns learning coding into an Adventure",10,img)
        event2 = e._id;
});
    } catch (error) {
        console.log(error)
    }
    try {
        let img = {};
        const promise = fs.promises.readFile('Assets/Singing.jpeg');
        await Promise.resolve(promise).then(async function(buffer){
        img.buffer = buffer;
        let e = await events.createEvent("Whistle While You learn singing","user3@ll.com","2023-12-03","14:00",
        "1 E 161 St, Bronx, NY 10451","userth","A Fun Workshop Filled with Surprises",15,img)
        event3 = e._id;
});
    } catch (error) {
        console.log(error)
    }
    try {
        let img = {};
        const promise = fs.promises.readFile('Assets/Finance.jpeg');
        await Promise.resolve(promise).then(async function(buffer){
        img.buffer = buffer;
        await events.createEvent("Financial Fitness","user4@ll.com","2023-12-04","19:00",
        "60 Zukor Rd, New City, NY 10956","userf","A Workshop for Mastering Personal Finance Skills",100,img)
});
    } catch (error) {
        console.log(error)
    }
    try {
        img = {};
        const promise = fs.promises.readFile('Assets/Project.jpeg');
        await Promise.resolve(promise).then(async function(buffer){
        img.buffer = buffer;
        await events.createEvent("Project Management Pro","user5@ll.com","2023-12-05","15:00",
        "401 Cottman Ave, Philadelphia, PA 19111","userfi","Skills Workshop for Effective Project Execution",32,img)
});
    } catch (error) {
        console.log(error)
    }
    try {
        img = {};
        const promise = fs.promises.readFile('Assets/Workplace.jpeg');
        await Promise.resolve(promise).then(async function(buffer){
        img.buffer = buffer;
        await events.createEvent("SkillCraft","user6@ll.com","2023-12-06","16:00",
        "401 Quarry Rd, San Carlos, CA 94070","users","A Workshop Series for Mastering Essential Workplace Skills",50,img)
});
    } catch (error) {
        console.log(error)
    }
    try {
        img = {};
        const promise = fs.promises.readFile('Assets/Dance.jpeg');
        await Promise.resolve(promise).then(async function(buffer){
        img.buffer = buffer;
        await events.createEvent("Hip Hop Hustle","user7@ll.com","2023-12-07","17:00",
        "1120 Roosevelt Ave, Redwood City, CA 94061","userse","Workshop for Street Dance and Urban Moves",0,img)
});
    } catch (error) {
        console.log(error)
    }
    try {
        img = {};
        const promise = fs.promises.readFile('Assets/Tennis.jpeg');
        await Promise.resolve(promise).then(async function(buffer){
        img.buffer = buffer;
        await events.createEvent("Ping Pong Precision","user7@ll.com","2023-12-07","17:00",
        "1120 Roosevelt Ave, Redwood City, CA 94061","userse","A Workshop for Sharpening Table Tennis Skills",0,img)
});
    } catch (error) {
        console.log(error)
    }
    try {
        await users.submitReview("user1@ll.com","Great Workshop","Had fun in this workshop!", event1.toString())
    } catch (error) {
        console.log(error)
    }
    try {
        await users.submitReview("user2@ll.com","A Well-Structured Workshop for Collaborative Skill Building","Incredibly valuable content delivered with enthusiasm and expertise—highly recommend!", event1.toString())
    } catch (error) {
        console.log(error)
    }
    try {
        await users.submitReview("user3@ll.com","Informative","Valuable Content and Actionable Strategies Workshop", event2.toString())
    } catch (error) {
        console.log(error)
    }
    try {
        await users.submitReview("user5@ll.com","Structured","Well-paced and organized, the workshop kept me engaged from start to finish.", event2.toString())
    } catch (error) {
        console.log(error)
    }
    try {
        await users.submitReview("user6@ll.com","Awesome for networking","Fantastic networking opportunities and a diverse range of perspectives shared.", event3.toString())
    } catch (error) {
        console.log(error)
    }
    await connection.closeConnection()

}


main();