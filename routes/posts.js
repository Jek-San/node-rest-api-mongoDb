const router = require("express").Router()
const Post = require("../models/Post")
const User = require("../models/User")

//create a post

router.post("/", async (req, res) => {
  const newPost = new Post(req.body)

  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost)
  } catch (error) {
    res.status(500).json(error)
  }
})

//update a post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body })
      res.status(200).json("the post has been updated")
    } else {
      res.status(403).json("you can update only your post")
    }
  }
  catch (error) {
    res.status(500).json(err)
  }


})
//delete a post
router.delete("/:id", async (req, res) => {
  console.log(req.body.userId)

  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne()
      res.status(200).json("the post has been deleted")
    } else {
      res.status(403).json("you can delete only your post")
    }
  }
  catch (error) {
    res.status(500).json(error)
  }


})

//like / dislike a post

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } })
      res.status(200).json("the post has been liked")
    } else {
      await post.updateOne({ $pull: { likes: req.bodu.userId } })
      res.status(200).json("The post has been disliked")
    }
  } catch (error) {
    res.status(500).json(error)
  }
})
//get a post

router.get("/:id", async (req, res) => {
  //   try {
  //     const post = await Post.findById(req.params.id)
  //     res.status(200).json(post)
  //   } catch (error) {
  //     res.status(500).json(error)
  //   }
  // })
  //get timeline posts
  // router.get("/timeline/all", async (req, res) => {
  //   try {
  //     const currentUser = await User.findById(req.body.userId)
  //     const userPosts = await Post.find({ userId: currentUser._id })
  //     const friendPosts = await Promise.all(
  //       currentUser.followings.map((friendId) => {
  //         return Post.find({ userId: friendId })
  //       })
  //     )
  //     res.json(userPosts.concat(...friendPosts))
  //   } catch (error) {
  //     res.status(500).json(error)
  //   }
  // })

  try {
    const currentUser = await User.findById(req.body.userId);
    const followingIds = currentUser.followings; // Assuming `followings` is an array of friend IDs

    const postsFromFollowing = await Post.find({ userId: { $in: followingIds } });

    res.json(postsFromFollowing);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching posts." });
  }
});

module.exports = router