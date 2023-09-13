const router = require("express").Router();
const Conversation = require("../models/Conversation")

//NEW CONVERSATIONS

router.post('/', async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId]
  })

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation)

  } catch (err) {
    console.log(err)
    res.status(500).json(err.message)
  }
})
//GET CONVERSATION OF USER
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] }
    })

    res.status(200).json(conversation)
  } catch (error) {
    console.log(error)

    res.status(500).json(error)
  }
})


//

module.exports = router