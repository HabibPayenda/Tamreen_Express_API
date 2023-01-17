const express = require('express');

const {
    createScanned,
    getScanned,
    getAllScanned
} = require('../controllers/QrsScannedControllers');

const router = express.Router();

router.route('/')
.get(getAllScanned)
.post(createScanned);

router.route('/:id')
.get(getScanned);


module.exports = router;