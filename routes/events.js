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
                 let ratings =  [{rate:1,eventId:req.params.id},{rate:2,eventId:req.params.id},{rate:3,eventId:req.params.id},{rate:4,eventId:req.params.id},{rate:5,eventId:req.params.id}]    
            let eventReviews = await index.events.getreviewsbyId(req.params.id);
            console.log(eventReviews);
            let details = await index.events.getEventbyId(req.params.id);
            req.session.eventId= details;
            return res.render('event_details',{title:'LearnLocally', head:'LearnLocally',name:details.name, date:details.date, time:details.time, venue: details.venue, host: details.host, description: details.description,eventId: details._id, reviews: eventReviews,rates:ratings});
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
  
  
module.exports = router