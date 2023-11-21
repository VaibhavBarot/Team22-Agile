const express = require('express');
const router = express.Router();
const eventData = require('../data/events');
const index = require('../data/index');
const xss = require('xss');

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
            let details = await index.events.getEventbyId(req.params.id);
            return res.render('event_details',{title:'LearnLocally', head:'LearnLocally',name:details.name, date:details.date, time:details.time, venue: details.venue, host: details.host, description: details.description});
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
      const { reportedEmailId, comment } = req.body;

      // Validate form data if needed

      // Use xss to sanitize input if necessary
      const sanitizedReportedEmailId = xss(reportedEmailId);
      const sanitizedComment = xss(comment);
      const sanitizedReporterEmailID = req.session.user.emailId

      // Call your createReport function or equivalent
      const result = await eventData.createReport(sanitizedReporterEmailID, sanitizedReportedEmailId, sanitizedComment)

      // Handle the result from the data file, you can customize this based on your needs
      res.status(200).render('successMsg', { successMessage: 'Report submitted successfully!' });

    } catch (error) {
      // console.error(error);
      res.status(500).render('errorMsg', { errorMessage: 'Error submitting report. Please try again.' });

    }
  });
  

module.exports = router