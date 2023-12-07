const express = require('express');
const router = express.Router();
const index = require('../data/index');
const xss = require('xss');

router.use(async(req,res,next) => {
    if(req.session.user){
        const messages = await index.users.retrieveMessages(req.session.user.emailId);
        let unreadMessage = (messages?.length) ? true:false;
        res.locals.messages = unreadMessage;
        res.locals.isLoggedIn = true
    }
    next();
})

router.route('/')
.get(async (req,res)=>{
    if (!req.session.user) {
        return res.redirect('/sign-in');
    }
    else {
        return res.render('./home',{title:'LearnLocally', head:'LearnLocally'});
    }
});
    

router.route('/sign-in')
.get(async (req,res)=>{
    return res.render('./sign_in',{title:'LearnLocally', head:'LearnLocally'});
})
.post(async (req, res) => {
    try {
        let emailId = xss(req.body.emailIdInput);
        let password = xss(req.body.passwordInput);

        emailId = emailId.trim().toLowerCase();
        password = password.trim();

        let user = await index.users.login(emailId, password);
        req.session.user = {emailId: emailId, firstName:user.firstName, lastName:user.lastName};
        const messages = await index.users.retrieveMessages(req.session.user.emailId);
        let unreadMessage = (messages?.length) ? true:false;
        res.locals.messages = unreadMessage;
        res.locals.isLoggedIn = true
        return res.render('./home',{title:'LearnLocally', head:'LearnLocally'})
    }catch(e) {
        return res.status(404).render('./sign_in', {title: "Sign-in Page", error: e})
    }
})

router.route('/sign-up')
.get(async (req, res) => {
    if (!req.session.user) {
        return res.render('./sign_up', {title: "LearnLocally",head:"LearnLocally"});
    } 
    else {
        res.redirect('/'); 
    }
})
.post(async (req, res) => {
    try {
        let emailId = xss(req.body.emailIdInput);
        let password = xss(req.body.passwordInput);
        let firstName = xss(req.body.firstName);
        let lastName = xss(req.body.lastName);
        await index.users.createUser(emailId, password, firstName, lastName);
        res.redirect('/sign-in');
    }catch(e) {
        res.status(404).render('./sign_up', {title: "Sign-up Form", error: e})
    }
})

router.route('/sign-out')
.get(async (req, res) => {
    req.session.destroy();
    res.clearCookie('AuthSession');
    res.redirect('/sign-in'); 
})

router.route('/create-event')
  .get(async (req, res) => {
    if(req.session.user){
        return res.render('create_event',{title:'LearnLocally', head:'LearnLocally'});
    }else{
        return res.redirect('/sign-in');
    }
     
})
  .post(async (req, res) => {
      try {
          let date = xss(req.body.date);
          let name = xss(req.body.name);
          let email = xss(req.body.emailIdInput)
          let time = xss(req.body.time)
          let venue = xss(req.body.venue)
          let description = xss(req.body.description)
          let host = xss(req.body.host)
          await index.events.createEvent(name, email, date, time, venue, host, description);
          res.redirect('/create-event');
      }catch(e) {
         console.log(e)
      }
  })

  router
.route('/allevents/request-event')
.get(async (req, res) => {
  if(req.session.user){
 
      return res.render('request_event',{title:'LearnLocally', head:'LearnLocally'});
  }else{
      return res.redirect('/sign-in');
  }
   
})

.post(async (req, res) => {
  try {
    
      let emailId = xss(req.body.emailIdInput);
      let description = xss(req.body.description)
      await index.events.requestEvent(emailId, description);
      res.redirect('/allevents/request-event');
  }catch(e) {
     console.log(e)
  }
})

router
.route('/registeredevents')
.get(async (req, res) => {
  if(req.session.user){
    const events = await index.users.registeredEvents(req.session.user.emailId);
            console.log('came........RG'+events);
            let ratings =  [{rate:1},{rate:2},{rate:3},{rate:4},{rate:5}]  
            
    return res.render('registered_events',{events:events,rates:ratings});
  }  
})

router
.route('/unregister')
.post(async (req, res) => {
  if(req.session.user){
    let eventId = xss(req.body.eventId);
    await index.users.unregisterForEvent(eventId,req.session.user.emailId)
    return res.redirect('registeredevents')
  }})
  
router.route('/send-message')
.get(async (req,res) => {
    res.render('./sendMessage')
})
.post(async (req,res) => {
    try{
        let email = xss(req.body.email)
        let description = xss(req.body.description)
    
        await index.users.postMessage(req.session.user.emailId,email,description);
        return res.status(200).render('./sendMessage', {message: 'Message successfully sent!'})
    }catch(e) {
        return res.status(404).render('./sendMessage', {title: "Message", error: e})
    }
})

router.route('/view-messages')
.get(async (req,res) => {
    try{
            const messages = await index.users.retrieveMessages(req.session.user.emailId);
            res.render('./viewMessages',{messages:messages})
    }catch(e){
        return res.status(404).render('./viewMessages', {title: "Message", error: e})
    }
})

router.route('/read-messages')
.post(async (req,res) => {
    try{
            await index.users.readMessages(req.session.user.emailId);
            res.locals.messages = false;
            res.status(200).render('./viewMessages');

    }catch(e){
        return res.status(404).render('./viewMessages', {title: "Message", error: e})
    }
})


router.route('/submit-review/:id')
  .get(async (req,res) => {
      let eventId= req.params.id;
      
      res.render('./submitReview',{eventId:eventId} )
  })
  .post(async (req,res) => {
      try{
            let title = xss(req.body.title);
           let description = xss(req.body.description)
           let eventId = xss(req.params.id);
           let rId = xss(req.body.rId);
           
          await index.users.submitReview(req.session.user.emailId,title,description,eventId,rId);
          //return res.redirect('./allevents/'+eventId)
          res.redirect('/allevents/'+eventId);
          //return res.status(200).render('./allevents/'+eventId, {message: 'Review submitted successfully.'})
      }catch(e) {
          return res.status(404).render('./submitReview', {title: "Message", error: e})
      }
  })

  router.route('/submit-rating/:id/:rid')
  .get(async (req,res) => {
      let rateId= req.params.rid
      let eventId= req.params.id;
      await index.users.submitRating(req.session.user.emailId,rateId,eventId);
      
      res.redirect('/allevents/'+eventId);
  })

  router.route('/edit-review/:id/:eventId')
  .get(async (req,res) => {
      
      let rId= req.params.id;
      let eventId= req.params.eventId;
    
      //await index.users.submitRating(req.session.user.emailId,rateId,eventId);
      let revDetails = await index.events.getreviewbyId(req.params.id);
      //res.redirect('/submit-review/'+eventId+'/1' )
      res.render('./submitReview',{eventId:eventId,rId:rId,title:revDetails.title,desc:revDetails.description} )
      
  })

  router.route('/delete-review/:id/:eventId')
  .get(async (req,res) => {
      
      let eventId= req.params.eventId;
      let rId = req.params.id;
       //await index.users.submitRating(req.session.user.emailId,rateId,eventId);
       let revDetails = await index.events.deleteReviewbyId(rId);
        
      //res.redirect('/submit-review/'+eventId+'/1' )
     res.redirect('/allevents/'+eventId);
      
  })
  
      
module.exports = router;