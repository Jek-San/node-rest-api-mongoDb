const router = require("express").Router();

router.get('/', (req, res) => {
  res.send("hey its from users Route")
})

module.exports = router;