"use strict"
const Week = require("../models/Week")
const User = require("../models/User")

exports.inputSchedule = (req, res) => {
    res.render("inputSchedule")
}
exports.addScheduleInput = async (req,res,next) => {
    
    try{
        let dates = req.body['date[]']
        let mileages = req.body['mileage[]']
        let workoutOrExtras = req.body['workoutOrExtra[]']
        let exercises = req.body['exercise[]']

        //trying to save selected users to apply schedule to
        // let selectedUsers = req.body['selectedUsersToApply[]']
        // console.log("SELECTED" ,selectedUsers)

        // let isChosen = new ChosenAthlete({
        //     isChosen: selectedUsers

        // })
        
        let days = []
        for(let i = 0; i < dates.length; i++){
            let d = new Date(dates[i])
            let day = { 
                mileage: mileages[i],
                exercise: exercises[i],
                workoutOrExtra: workoutOrExtras[i],
                year: d.getFullYear(),
                month: d.getMonth() + 1,
                day: d.getDate() + 1,
                dayOfWeek: d.getDay() + 1,
            }
            days.push(day)
        }
        let newWeek = new Week({
            // userId: ObjectId,
            days,
            startYear: days[0].year,
            startMonth: days[0].month,
            startDay: days[0].day,
        })

        res.locals.athleteList = await User.find()
        await newWeek.save().then((week) => {
            console.log(week)
        })
        res.render("inputSchedule")
    } catch(e){
        next(e)
    }
}

