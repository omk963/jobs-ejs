const Job = require('../models/Job')

const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ createdBy: req.user._id }).sort('createdAt')
        // res.status(200).json({ jobs, count: jobs.length })
        res.render("jobs", { jobs });
    } catch (error) {
        req.flash('error', 'Error fetching jobs');
        return res.redirect('/jobs')
    }
}

const getJob = async (req, res) => {
    const { id: jobId } = req.params;
    try {
        const job = await Job.findOne({
            _id: jobId, createdBy: req.user._id
        });
        if (!job) {
            req.flash('error', `No job found with id ${jobId}`);
            return res.redirect('/jobs');
        }
        res.render("job", { job });
    } catch (error) {
        req.flash('error', 'Error fetching the job');
        return res.redirect('/jobs')
    }
}

const getCreate = async (req, res) => {
    res.render("job", { job: null });
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user._id;
    const job = await Job.create(req.body)

    req.flash("success", "The job was added.");
    res.redirect("/jobs");
}

const updateJob = async (req, res) => {
    const { id: jobId } = req.params;
    const { company, position } = req.body;

    if (company === '' || position === '') {
        req.flash('error', 'Company and Position fields cannot be empty');
        return res.redirect('/jobs');
    }

    try {
        const job = await Job.findByIdAndUpdate({ _id: jobId, createdBy: req.user._id }, req.body, { new: true, runValidators: true })
        if (!job) {
            req.flash('error', `No job found with id ${jobId}`);
            return res.redirect('/jobs');

        }
        // res.render("job", { job })
        req.flash('success', 'Job updated successfully');
        return res.redirect("/jobs");
    } catch (error) {
        req.flash('error', 'Error updating the job');
        return res.redirect('/jobs');
    }
}

const deleteJob = async (req, res) => {
    const { id: jobId } = req.params;

    try {
        const job = await Job.findByIdAndDelete({
            _id: jobId,
            createdBy: req.user._id
        })
        console.log(job)
        if (!job) {
            req.flash('error', `No job found with id ${jobId}`);
            return res.redirect('/jobs');
        }
        req.flash('success', 'Job deleted successfully');
        return res.redirect("/jobs");
        // res.status(200).json({ msg: "The entry was deleted." });
        // res.render("jobs", { jobs });
    } catch (error) {
        req.flash('error', 'Error deleting the job');
        return res.redirect('/jobs');
    }
}


module.exports = {
    getAllJobs,
    getJob,
    getCreate,
    createJob,
    updateJob,
    deleteJob
}