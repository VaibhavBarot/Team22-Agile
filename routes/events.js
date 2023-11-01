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
        await index.events.registerForEvent(id);
        res.redirect('/allevents/'+id);
    }catch(e) {
       console.log(e)
    }
  })
  

module.exports = router