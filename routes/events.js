const express = require('express');
const router = express.Router();
const eventData = require('../data/events');
const index = require('../data/index');
const xss = require('xss');
const { reviews } = require('../config/mongocollections');
const mongoCollections = require('../config/mongocollections');
const users = mongoCollections.users


// Function to check if the email exists in the seed.js file
function isEmailInSeedFile(email) {
  return seedData.emails.includes(email);
}

router
.route('/')
.get(async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/sign-in');
        }
        // if(!allevents){
        //     throw 'No Events'
        // }
        else{
            let allevents = await index.events.getAllEvents();
            return res.status(200).render('upcoming_events',{title:'LearnLocally', head:'LearnLocally',events:allevents});
        }
        } catch (e) {
            res.status(404).render('errorPage', {error:e});
        }
        

})

router
.route('/:id')
.get(async(req,res)=>{
    try {
        if (!req.session.user) {
            return res.redirect('/sign-in');
        }
        else {
                    
            let eventReviews = await index.events.getreviewsbyId(req.params.id);
           
            let details = await index.events.getEventbyId(req.params.id);

            let rating =await index.events.getRatingById(req.params.id)
            let ratings =  [{rate:1,eventId:req.params.id,rid:rating.rid},{rate:2,eventId:req.params.id,rid:rating.rid},{rate:3,eventId:req.params.id,rid:rating.rid},{rate:4,eventId:req.params.id,rid:rating.rid},{rate:5,eventId:req.params.id,rid:rating.rid}]
            req.session.eventId= details;
            return res.render('event_details',{title:'LearnLocally', head:'LearnLocally',name:details.name, date:details.date, time:details.time, venue: details.venue, host: details.host, description: details.description,eventId: details._id, reviews: eventReviews,rates:ratings, price:details.price});
        }
    } catch (e) {
        return res.status(404).render('errorPage',{error:e});
    }
})
.post(async (req, res) => {
    try {
        
        let id = xss(req.params.id);

        let event = await index.events.getEventbyId(id)

        let emailid = xss(req.session.user.emailId)
        await index.users.registerForEvent(id, emailid, event);
        res.redirect('/allevents/'+id);
    }catch(e) {
       console.log(e)
    }
  })

  router
  .route('/api/report')
  .get(async (req, res) => {
    try {
      // You can add any logic needed for handling the GET request
      // console.log("Report GET fIRED");
      res.render('reportForm');
    } catch (error) {
      // console.error(error);
      res.status(500).render('errorPage', { error: 'Internal Server Error' });
    }
  })
  
  .post(async (req, res) => {
    try {
        // console.log("Report Post method Fired");
      // Assuming you have a function to handle report creation in your data file
      const {EmailId, comment } = req.body;
      let validEmailRegex = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/
      if (!EmailId.match(validEmailRegex)){
        // return res.status(500).render('errorPage', { error: 'Invalid EmailId' });
        return res.status(500).render('errorMsg', { errorMessage: 'Invalid EmailId. Please try again.' });
      }
      const userCollection = await users();
      const user = await userCollection.findOne({
        emailId: EmailId
   });
      if(!user){
        return res.status(500).render('errorMsg', { errorMessage: `User with this ${EmailId} does not exist` });
  }
      // Validate form data if needed

      // Use xss to sanitize input if necessary
      const sanitizedEmailId = xss(EmailId);
      const sanitizedComment = xss(comment);
      const sanitizedReporterEmailID = req.session.user.emailId

      // Call your createReport function or equivalent
      const result = await eventData.createReport(sanitizedReporterEmailID, sanitizedEmailId, sanitizedComment)

      // Handle the result from the data file, you can customize this based on your needs
      res.status(200).render('successMsg', { successMessage: 'Report submitted successfully!' });

    } catch (error) {
      // console.error(error);
      res.status(500).render('errorMsg', { errorMessage: 'Error submitting report. Please try again.' });

    }
  });
  
  
  
  
module.exports = router
