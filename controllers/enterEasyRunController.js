"use strict"

const EasyRun = require("../models/EasyRun")

exports.easyRunPage = (req, res) => {
    console.log("test")
    res.render("easyRun")
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
    } catch(e){
        console.log(e)
    }
}
