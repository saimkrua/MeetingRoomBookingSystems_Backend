const express = require('express');
const router = express.Router();
const usersController = require("../controller/usersController");

router.get("/", usersController.getAllUser);
router.post("/", usersController.createNewUser);

module.exports = router;