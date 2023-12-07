const express = require('express');
const router = express.Router();
const eventData = require('../data/events');
const index = require('../data/index');
const xss = require('xss');
const { reviews,users,events } = require('../config/mongocollections');
const { ObjectId } = require('mongodb');



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
            const userCollection = await users();
            const count = await userCollection.findOne({"RegisteredEvents._id":req.params.id});
            const eventCollection = await events();
            const rateCount = await eventCollection.findOne({"_id":new ObjectId(req.params.id) ,"EventRating.email": req.session.user.emailId});
            let  EvenRates = await index.events.eventRatings(req.params.id);
            console.log('Rates.....'+EvenRates);
            let total = 0;
            let TotalRate = 0;
            if(EvenRates) {
            for(var i=0; i<EvenRates.length; i++) {
                 total= Number(total)+Number(EvenRates[i].rid);
            }
            TotalRate =total/EvenRates.length;
        }
            console.log('Rates.....'+total);
            // console.log('Avg.....'+TotalRate);
            // console.log('Rate count.....'+rateCount);
            let hrefUrl= "";
           if(count !== null && rateCount === null){
               hrefUrl= "/submit-rating/"+req.params.id;
           }else {
               hrefUrl=  "javascript:void(0)}"
           }
            console.log('href...'+hrefUrl)
            let rating =await index.events.getRatingById(req.params.id)
            let ratings =  [{rate:1,eventId:req.params.id,rid:TotalRate,hrefUrl:hrefUrl},{rate:2,eventId:req.params.id,rid:TotalRate,hrefUrl:hrefUrl},{rate:3,eventId:req.params.id,rid:TotalRate,hrefUrl:hrefUrl},{rate:4,eventId:req.params.id,rid:TotalRate,hrefUrl:hrefUrl},{rate:5,eventId:req.params.id,rid:TotalRate,hrefUrl:hrefUrl}] 
             req.session.eventId= details;
            return res.render('event_details',{title:'LearnLocally', head:'LearnLocally',name:details.name, date:details.date, time:details.time, venue: details.venue, host: details.host, description: details.description,eventId: details._id, reviews: eventReviews,rates:ratings,hrefUrl:hrefUrl});
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