const express = require('express');
const router = express.Router();
const usersController = require("../controller/usersController");

router.post("/signup", usersController.signUpNewUser);
router.post("/signin", usersController.signInUser);

module.exports = router;