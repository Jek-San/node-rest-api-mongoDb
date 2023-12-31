const router = require("express").Router();
const User = require("../models/User.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken"); // Import the jwt library

//REGISTER


router.post('/register', async (req, res) => {

  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    })

    //save user and return response
    const user = await newUser.save();
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)

  }

  // const user = await new User({
  //   username: "jack",
  //   email: "jack@gmail.com",
  //   password: "666666"
  // })

  // await user.save()
  // res.send("oke")
})

//LOGIN
router.post("/login", async (req, res) => {
  console.log("login api on call")
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send("User not found!");
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
      return res.status(400).json("Wrong password");
    }


    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});
// router.post("/login", async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email })
//     !user && res.status(404).send("user not found!")

//     const validPassword = await bcrypt.compare(req.body.password, user.password)

//     !validPassword && res.status(400).json("wrong password")

//     res.status(200).send(user)
//   } catch (error) {
//     res.status(500).json(error)

//   }
// })

module.exports = router