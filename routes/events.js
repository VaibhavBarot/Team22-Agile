const express = require('express');
const router = express.Router();
const eventData = require('../data/events');
const index = require('../data/index');
const xss = require('xss');
const { reviews } = require('../config/mongocollections');


router
.route('/')
.get(async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/sign-in');
        }
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
      res.render('reportForm');
    } catch (error) {
      res.status(500).render('errorPage', { error: 'Internal Server Error' });
    }
  })
  .post(async (req, res) => {
    try {
      const { reportedEmailId, comment } = req.body;
      const sanitizedReportedEmailId = xss(reportedEmailId);
      const sanitizedComment = xss(comment);
      const sanitizedReporterEmailID = req.session.user.emailId
      const result = await eventData.createReport(sanitizedReporterEmailID, sanitizedReportedEmailId, sanitizedComment)

  
      res.status(200).render('successMsg', { successMessage: 'Report submitted successfully!' });
    } catch (error) {
     res.status(500).render('errorMsg', { errorMessage: 'Error submitting report. Please try again.' });

    }
  });
  
  
module.exports = router