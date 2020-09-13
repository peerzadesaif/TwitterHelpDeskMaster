const router = require("express").Router();

router.use("/auth", require("./api/auth"));
router.use("/twitter", require("./api/twitter"));

module.exports = router;
