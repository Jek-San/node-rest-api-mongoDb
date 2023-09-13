const router = require("express").Router();
const Message = require("../models/Message")

//ADD

router.post("/", async (req, res) => {
  const newMessage = new Message(req.body)

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router