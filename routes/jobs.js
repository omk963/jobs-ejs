const express = require('express')
const router = express.Router()

const { getAllJobs, getCreate, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobs')

router.route('/')
    .get(getAllJobs)
    .post(createJob)
router.route('/new')
    .get(getCreate)
router.route('/edit/:id')
    .get(getJob)
router.route('/update/:id')
    .post(updateJob)
router.route('/delete/:id')
    .post(deleteJob)


module.exports = router