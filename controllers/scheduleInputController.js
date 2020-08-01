const Day = require("../models/Day")
const Week = require("../models/Week")
const User = require("../models/User")
const WeekToUser = require("../models/WeekToUser")
const {addWeek} = require("../helpers/weekHelper")
const { set } = require("mongoose")

// GET Request
exports.inputSchedule = (req, res) => {
    User.find().then((athleteList) => {
        res.locals.athleteList = athleteList
        res.render("inputSchedule")
    })
}

// POST Request
exports.addScheduleInput = async (req, res, next) => {
    console.log("Made it to addScheduleInput")
    try{
        let dates = req.body.dates
        let mileages = req.body.mileages
        let workoutOrExtras = req.body.workoutOrExtras
        let exercises = req.body.exercises
        // let selectedUsers = req.body['selectedUsersToApply[]']
        let userIDs = req.body.userIDs // same length as selected
        // let selected = req.body['selected[]'] // same length as userIDs - array of 0s and 1s (as Strings)
        let week = await addWeek(mileages, workoutOrExtras, exercises)
        // WEEK TO USER

        // days - at each index, has day, each day has an id (length of 7)
        // dayIdSet - an arry with the Ids in the right order (not necessarily have a length of 7)

        console.log(week)
        let dayIdArr = week[0].dayIds.sort()
        let weekId = week[0].id
        let days = week[1]
        // Creates Order Array
        let order = []
        for (let i = 0; i < days.length; i++) {
            let dayId = days[i].id 
            let dayIdIndex = dayIdArr.indexOf(dayId)
            order.push(dayIdIndex)
        }

        // Adding Week For Each User 
        for (let i = 0; i < userIDs.length; i++) {

            let monday = new Date()
            let today = monday.getDay() // saving today's date
            let distanceToMonday
            if (today != 0) {
                distanceToMonday = today - 1
            } else {
                distanceToMonday = 6
            }
            monday.setDate(monday.getDate() - distanceToMonday)


            let weekToUser = new WeekToUser({
                userId: userIDs[i],
                weekId: weekId,
                dayOrder: order,
                year: monday.getFullYear(),
                month: monday.getMonth() + 1,
                day: monday.getDate(),
            })

            let weekToUser2 = await weekToUser.save()
            console.log(weekToUser2)
        }

        res.json({ 
           success: true
        })

    } catch(e) {
        res.json({
            success: false
        })
        next(e)
    }
}

