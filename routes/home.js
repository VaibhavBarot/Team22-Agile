const express = require('express');
const router = express.Router();
const index = require('../data/index');
const xss = require('xss');

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


module.exports = router;