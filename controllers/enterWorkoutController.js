"use strict"
const Workout = require("../models/Workout")

exports.workoutPage = (req, res) => {
    res.render("workout")
}

exports.postedWorkoutForm = async (req,res) => {
    let grade = req.body.grade
    let gradeColor = homecontroller.setGradeColor(grade)
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
    } catch(e) {
        console.log(e)
    }
}