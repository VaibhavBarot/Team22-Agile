const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const mongoCollections = require('../config/mongocollections');
const users = mongoCollections.users
const xss = require('xss');

router
.route('/')
.get(async(req, res) => {
    try {
        const user = req.session.user
        if(!user){
            return res.redirect('/sign-in');
        }
        return res.render('profile', {user:user})
    } catch (error) {
        
    }
})
router
.route('/add-bio')
.post(async(req, res) => {
    try {
        const user = req.session.user
        if(!user){
            return res.redirect('/sign-in');
        }
        // console.log('hdbsujns')
        const {bio} = req.body;
        const userbio=bio;
        // console.log(userbio);
        const emailId=req.session.user.emailId;
        const userCollection = await users();
        const updateInfo=await userCollection.updateOne({ emailId: emailId }, { $set: { bio: userbio } });
        req.session.user.bio=userbio;
        // console.log(updateInfo.modifiedCount)
        // Redirect back to the profile page
        res.redirect('/profile');

    } catch (error) {
        
    }
})
module.exports = router