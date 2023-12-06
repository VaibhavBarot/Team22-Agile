const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const mongoCollections = require('../config/mongocollections');
const users = mongoCollections.users
const xss = require('xss');
const path = require('path'); // Import the path module
const fs = require('fs');
const multer = require('multer');
const storage = multer.memoryStorage(); // You can customize storage as per your needs
const upload = multer({ storage: storage });


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
        const {bio} = req.body;
        const userbio=bio;
        const emailId=req.session.user.emailId;
        const userCollection = await users();
        const updateInfo=await userCollection.updateOne({ emailId: emailId }, { $set: { bio: userbio } });
        req.session.user.bio=userbio;
        res.redirect('/profile');

    } catch (error) {
        
    }
})


router
.route('/add-profile')
.post(upload.single('profilePicture'), async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) {
      return res.redirect('/sign-in');
    }

    const emailId = req.session.user.emailId;
    const userCollection = await users();

    // Handle profile picture upload
    let profilePictureUrl = '';
    if (req.file) {
      // Handle file upload and save the URL to the profilePictureUrl variable
      // You may want to store the image in a CDN or a specific folder
      // and save the URL to the database
      // Example: profilePictureUrl = 'https://your-cdn.com/uploads/profile-pics/' + req.file.filename;

      // For demonstration purposes, let's assume the image is stored in-memory
      const fileBuffer = req.file.buffer;
      const fileName = `profile-pic-${Date.now()}.png`; // You can generate a unique filename
      // Here, you would typically upload the file to your storage solution (e.g., AWS S3, Google Cloud Storage)
      // and get the URL.
      // For simplicity, we'll assume you're storing it in the 'public/uploads' folder.
      const filePath = path.join(__dirname, '../public/uploads/', fileName);

      // Write the buffer to the file
      fs.writeFileSync(filePath, fileBuffer);

      // Set the profile picture URL
      profilePictureUrl = `/uploads/${fileName}`;

      // Now, you would save the profilePictureUrl to the database
      await userCollection.updateOne(
        { emailId: emailId },
        {
          $set: {
            profilePicture: profilePictureUrl,
          },
        }
      );

      // Update the session user object
      req.session.user.profilePicture = profilePictureUrl;
    }

    res.redirect('/profile');
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

  module.exports = router