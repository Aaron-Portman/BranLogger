"use strict"
const Week = require("../models/Week")
const User = require("../models/User")
const WeekToUser = require("../models/WeekToUser")

exports.inputSchedule = (req, res) => {
    User.find().then((athleteList) => {
        res.locals.athleteList = athleteList
        res.render("inputSchedule")
    })
}
exports.addScheduleInput = (req, res, next) => {
    
    try{
        let dates = req.body['date[]']
        let mileages = req.body['mileage[]']
        let workoutOrExtras = req.body['workoutOrExtra[]']
        let exercises = req.body['exercise[]']
        // let selectedUsers = req.body['selectedUsersToApply[]']
        let userIDs = req.body['userIDs[]']
        let selected = req.body['selected[]']

       // trying to save selected users to apply schedule to
        

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
            // startYear: days[0].year,
            // startMonth: days[0].month,
            // startDay: days[0].day,
        })
        newWeek.save().then((week) => {
            let monday = new Date()
            let today = monday.getDay()
            let distanceToMonday
            if(today != 0){
                distanceToMonday = today - 1
            } else {
                distanceToMonday = 6
            }
            monday.setDate(monday.getDate() - distanceToMonday)

            console.log(week)
            // console.log("SELECTED" ,selected)
            for(let i = 0; i < userIDs.length; i++){
                if(selected[i] == "1"){
                    let weekToUser = new WeekToUser({
                        userId: userIDs[i],
                        weekId: week.id,
                        year: monday.getFullYear(),
                        month: monday.getMonth() + 1,
                        day: monday.getDate(),
                    })
                    weekToUser.save().then((wtu)=>{
                        console.log(wtu) 
                    })   
                }
            }
        })
        
    } catch(e) {
        next(e)
    }
}

