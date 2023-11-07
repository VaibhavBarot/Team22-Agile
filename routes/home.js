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
        res.redirect('/');
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
    return res.render('registered_events',{events:events});
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
    
        await index.users.postMessage(email,description);
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

module.exports = router;