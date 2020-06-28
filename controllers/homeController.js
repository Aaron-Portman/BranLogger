"use strict";
const EasyRun = require("../models/EasyRun")
const Workout = require("../models/Workout")

exports.homeScreen = (req, res) => {
    res.render("home")
}
exports.easyRunPage = (req, res) => {
    res.render("easyRun")
}
exports.workoutPage = (req, res) => {
    res.render("workout")
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

        let avgTime = avgMinutes + ":" + avgSeconds
        console.log("seconds: " + seconds)
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
            grade: req.body.grade,
        })
        
        await newEasyRun.save().then((run) => {
            let id = run._id
            console.log(run)
            res.redirect("/showLog/" + id)
        })    
    } catch(e){
        console.log(e)
    }
}

exports.postedWorkoutForm = async (req,res) => {
    try{
        let d = new Date(req.body.date)
        let newWorkout = new Workout({
            year: d.getFullYear(),
            month: d.getMonth(),
            day: d.getDate(),
            dayOfWeek: d.getDay(),
            workout: req.body.workout,
            notes: req.body.notes,
            grade: req.body.grade,
        })
        
        await newWorkout.save().then((workout) => {
            let id = workout._id
            console.log(workout)
            res.redirect("/showLog/" + id)
        })
    } catch(e){
        console.log(e)
    }

}
exports.showLog = async (req,res) => {
    try{
        res.locals.workouts = await Workout.find({userId: req.id})
        res.locals.easyruns = await EasyRun.find({userId: req.id})
        res.render("showLog")
    } catch(e){
        console.log(e)
    }
}

