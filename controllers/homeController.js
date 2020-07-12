"use strict"
const User = require("../models/User")

exports.homeScreen = async (req, res, next) => {
    try {
        if (req.user !== undefined && req.user !== null) {
            res.locals.teamMembers = await User.find()
            res.render("home")
        } else {
            res.render("login")
        }
    } catch(e) {
        next(e)
    }
}

exports.showLog = async (req,res) => {
    try {
        res.locals.workouts = await Workout.find({userId: req.params.id})
        res.locals.easyruns = await EasyRun.find({userId: req.params.id})
        res.locals.crosstrains = await CrossTrain.find({userId: req.params.id})
        res.render("showLog")
    } catch(e) {
        console.log(e)
    }
}

function setGradeColor(grade) {
    if (grade == "Excellent") {
        gradeColor = "#309143"
    } else if (grade == "Very Good") {
        gradeColor = "#51b364"
    } else if (grade == "Good") {
        gradeColor = "#8ace7e"
    } else if (grade == "Neutral") {
        gradeColor = "#ffda66"
    } else if (grade == "Not Good") {
        gradeColor = "#f0bd27"
    } else if (grade == "Very Bad") {
        gradeColor = "#e03531"
    } else if (grade == "Terrible") {
        gradeColor = "#b60a1c"
    }
    return gradeColor
}

