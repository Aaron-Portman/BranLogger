"use strict"

const EasyRun = require("../models/EasyRun")
const WeekToUser = require("../models/WeekToUser")
const Week = require("../models/Week")
const Day = require("../models/Day")

exports.easyRunPage = async (req, res) => {
    console.log("entered get")
    let monday = new Date()
    let today = monday.getDay() // saving today's date
    let distanceToMonday
    if (today != 0) {
        distanceToMonday = today - 1
    } else {
        distanceToMonday = 6
    }
    monday.setDate(monday.getDate() - distanceToMonday)
    
    let weekToUser = await WeekToUser.findOne({
        userId: req.user._id,
        year: monday.getFullYear(),
        month: monday.getMonth() + 1,
        day: monday.getDate(),
    })
    console.log("week to user found: "  + weekToUser)

    let week = await Week.findOne({
        _id: weekToUser.weekId
    })
    console.log("week found")
    week.dayIds.sort()

    let dayToFindIndex = weekToUser.dayOrder[distanceToMonday]
    let dayToReturn = await Day.findOne(week.dayIds[dayToFindIndex])
    
    //find the day where the .getDate == distance to monday
    res.locals.mileage = dayToReturn.mileage
    res.locals.exercises = dayToReturn.exercises
    res.locals.workoutOrExtras = dayToReturn.workoutOrExtras
    
    res.render("easyRun")
}

exports.postedEasyRunForm = async (req,res) => {  
    try{
        let d = new Date(req.body.date)
        
        let minutes = req.body.minutes
        if (minutes === null || minutes === "") {
            minutes = 0
        }
        let seconds = req.body.seconds
        if (seconds === null || seconds === "") {
            seconds = 0
        }
        if (parseInt(seconds) < 10 && seconds.length === 1) {
            seconds = "0" + seconds
        }
        let totalSeconds = parseInt(minutes) * 60 + parseInt(seconds)
        let avgPerInSeconds = totalSeconds / req.body.mileage
        let avgMinutes = Math.floor(avgPerInSeconds / 60)
        let avgSeconds = Math.floor(avgPerInSeconds % 60)
        if (avgSeconds < 10) {
            avgSeconds = "0" + avgSeconds
        }

        let grade = req.body.grade
        let gradeColor = homeController.setGradeColor(grade)
 
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
    } catch(e) {
        console.log(e)
    }
}
