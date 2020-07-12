"use strict"

const CrossTrain = require("../models/CrossTrain")

exports.crossTrainPage = (req, res) => {
    res.render("crossTrain")
}

exports.postedCrossTrainForm = async (req,res) => {
    let grade = req.body.grade
    let gradeColor = homecontroller.setGradeColor(grade)
    try{
        let d = new Date(req.body.date)
        let newCrossTrain = new CrossTrain({
            year: d.getFullYear(),
            month: d.getMonth(),
            day: d.getDate(),
            dayOfWeek: d.getDay(),
            workout: req.body.workout,
            time: req.body.time,
            notes: req.body.notes,
            grade,
            gradeColor,
            userId: req.user._id,
        })
        await newCrossTrain.save().then((crossTrain) => {
            console.log(crossTrain)
            res.redirect("/showLog/" + req.user._id)
        })
    } catch(e) {
        console.log(e)
    }
}

