"use strict"
const Week = require("../models/Week")

exports.addScheduleInput = async (req,res) => {
    
    try{
        let dates = req.body['date[]']
        let mileages = req.body['mileage[]']
        let workoutOrExtras = req.body['workoutOrExtra[]']
        let exercises = req.body['exercise[]']
        console.log(exercises)
        console.log(req.body)
        
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
                dayOfWeek: d.getDay(),
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




        await newWeek.save().then((week) => {
            console.log(week)
        })
    } catch(e){
        console.log(e)
    }
}

