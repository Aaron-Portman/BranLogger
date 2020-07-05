"use strict";
const EasyRun = require("../models/EasyRun")
const Workout = require("../models/Workout")
const User = require("../models/User")
const CrossTrain = require("../models/CrossTrain")

exports.homeScreen = async (req, res, next) => {
    try{
        if(req.user !== undefined && req.user !== null) {
            res.locals.teamMembers = await User.find()
            res.render("home")
        } else {
            res.render("login")
        }
    } catch(e) {
        next(e)
    }
}
exports.easyRunPage = (req, res) => {
    res.render("easyRun")
}
exports.workoutPage = (req, res) => {
    res.render("workout")
}
exports.crossTrainPage = (req, res) => {
    res.render("crossTrain")
}

exports.inputSchedule = (req, res) => {
    res.render("inputSchedule")
}

exports.postedCrossTrainForm = async (req,res) => {
    let grade = req.body.grade
    let gradeColor = setGradeColor(grade)
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
    } catch(e){
        console.log(e)
    }
}


exports.postedEasyRunForm = async (req,res) => {

    
    try{
        let d = new Date(req.body.date)
        
        let minutes = req.body.minutes
        if(minutes === null || minutes === ""){
            minutes = 0
        }
        let seconds = req.body.seconds
        if(seconds === null || seconds === ""){
            seconds = 0
        }
        if (parseInt(seconds) < 10 && seconds.length === 1){
            seconds = "0" + seconds
        }
        let totalSeconds = parseInt(minutes) * 60 + parseInt(seconds)
        let avgPerInSeconds = totalSeconds / req.body.mileage
        let avgMinutes = Math.floor(avgPerInSeconds / 60)
        let avgSeconds = Math.floor(avgPerInSeconds % 60)
        if(avgSeconds < 10){
            avgSeconds = "0" + avgSeconds
        }

        let grade = req.body.grade
        let gradeColor = setGradeColor(grade)
 
        let avgTime = avgMinutes + ":" + avgSeconds
        let newEasyRun = new EasyRun({
            avgTime,
            minutes,
            seconds,
            year: d.getFullYear(),
            month: d.getMonth(),
            day: d.getDate(),
            dayOfWeek: d.getDay(),
            mileage: req.body.mileage,
            notes: req.body.notes,
            grade,
            gradeColor,
            userId: req.user._id,   
        })        
        await newEasyRun.save().then((run) => {
            console.log(run)
            res.redirect("/showLog/" + req.user._id)
        })    
    } catch(e){
        console.log(e)
    }
}

exports.postedWorkoutForm = async (req,res) => {
    let grade = req.body.grade
    let gradeColor = setGradeColor(grade)
    try{
        let d = new Date(req.body.date)
        let newWorkout = new Workout({
            userId: req.user._id,
            year: d.getFullYear(),
            month: d.getMonth(),
            day: d.getDate(),
            dayOfWeek: d.getDay(),
            workout: req.body.workout,
            notes: req.body.notes,
            grade,
            gradeColor,
        })
        
        await newWorkout.save().then((workout) => {
            console.log(workout)
            res.redirect("/showLog/" + req.user._id)
        })
    } catch(e){
        console.log(e)
    }

}
exports.showLog = async (req,res) => {
    try{
        res.locals.workouts = await Workout.find({userId: req.params.id})
        res.locals.easyruns = await EasyRun.find({userId: req.params.id})
        res.locals.crosstrains = await CrossTrain.find({userId: req.params.id})
        res.render("showLog")
    } catch(e){
        console.log(e)
    }
}

function setGradeColor(grade) {
    if(grade == "Excellent") {
        gradeColor = "#309143"
    } else if(grade == "Very Good") {
        gradeColor = "#51b364"
    } else if(grade == "Good") {
        gradeColor = "#8ace7e"
    } else if(grade == "Neutral") {
        gradeColor = "#ffda66"
    } else if(grade == "Not Good") {
        gradeColor = "#f0bd27"
    } else if(grade == "Very Bad") {
        gradeColor = "#e03531"
    } else if(grade == "Terrible") {
        gradeColor = "#b60a1c"
    }
    return gradeColor
}

