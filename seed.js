const connection = require("./config/mongoconnection");
const {ObjectId} = require("mongodb");
const users = require("./data/users");
const events = require("./data/events")

const main = async() => {
    const db = await connection.dbConnection();
    await db.dropDatabase();
    try {
        let user1 = await users.createUser("usero","one","user1@ll.com","Qwerty@123")  
    } catch (error) {
        console.log(error)
    }
    try {
        let user2 = await users.createUser("usert","two","user2@ll.com","Qwerty@123")  
    } catch (error) {
        console.log(error)
    }
    try {
        let user3 = await users.createUser("userth","three","user3@ll.com","Qwerty@123")  
    } catch (error) {
        console.log(error)
    }
    try {
        let user4 = await users.createUser("userf","four","user4@ll.com","Qwerty@123")  
    } catch (error) {
        console.log(error)
    }
    try {
        let user5 = await users.createUser("userfi","five","user5@ll.com","Qwerty@123")  
    } catch (error) {
        console.log(error)
    }
    try {
        let user6 = await users.createUser("users","six","user6@ll.com","Qwerty@123")  
    } catch (error) {
        console.log(error)
    }
    try {
        let user7 = await users.createUser("userse","seven","user7@ll.com","Qwerty@123")  
    } catch (error) {
        console.log(error)
    }
    try {
        let event1 = await events.createEvent("event1","user1@ll.com","2023-12-01","13:00","venue1","usero","event1 by user1")
    } catch (error) {
        console.log(error)
    }
    try {
        let event2 = await events.createEvent("event2","user2@ll.com","2023-12-02","18:00","venue2","usert","event2 by user2")
    } catch (error) {
        console.log(error)
    }
    try {
        let event3 = await events.createEvent("event3","user3@ll.com","2023-12-03","14:00","venue3","userth","event3 by user3")
    } catch (error) {
        console.log(error)
    }
    try {
        let event4 = await events.createEvent("event4","user4@ll.com","2023-12-04","19:00","venue4","userf","event4 by user4")
    } catch (error) {
        console.log(error)
    }
    try {
        let event5 = await events.createEvent("event5","user5@ll.com","2023-12-05","15:00","venue5","userfi","event5 by user5")
    } catch (error) {
        console.log(error)
    }
    try {
        let event6 = await events.createEvent("event6","user6@ll.com","2023-12-06","16:00","venue6","users","event6 by user6")
    } catch (error) {
        console.log(error)
    }
    try {
        let event7 = await events.createEvent("event7","user7@ll.com","2023-12-07","17:00","venue7","userse","event7 by user7")
    } catch (error) {
        console.log(error)
    }
    await connection.closeConnection()

}


main();