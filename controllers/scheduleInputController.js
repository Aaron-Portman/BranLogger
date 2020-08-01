const Day = require("../models/Day")
const Week = require("../models/Week")
const User = require("../models/User")
const WeekToUser = require("../models/WeekToUser")
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

        // Trim All User Input
        for (let i = 0; i < mileages.length; i++) {
            mileages[i] = mileages[i].trim()
            workoutOrExtras[i] = workoutOrExtras[i].trim()
            exercises[i] = exercises[i].trim()
        }

        // DAYS

        // List Of Ids Of Specific Days

        let dayIdSet = new Set() // Distinct Day Ids
        let days = [] // All Days (length of 7)
        
        // For each day
        for (let i = 0; i < mileages.length; i++) {
            let inputDay = {
                mileage: mileages[i],
                exercises: exercises[i],
                workoutOrExtras: workoutOrExtras[i],
            }
            
            // Check if it's in the database
            let day = await Day.findOne(inputDay)
            // If so, get the Id
            if (day) {
                days.push(day)
                dayIdSet.add(day.id) 
            } else { // else, Insert It
                // delete inputDay._id
                let day2 = new Day(inputDay)
                
                let insertedDay = await day2.save()
                days.push(insertedDay)
                dayIdSet.add(insertedDay.id) 
            }
        }

        // WEEKS
        let weekId
        let dayIdArr = [...dayIdSet]
        console.log('dayIdArr is ', dayIdArr)
        // Insert A Week If It Doesn't Exist
        let searchWeek = await Week.find({ 
            days: { "$size" : dayIdSet.size, "$all": dayIdArr }  
        })
        // if it exists, get the id
        if (searchWeek.length > 0) {
            weekId = searchWeek.id 
            dayIdArr = searchWeek.dayIdSet
        } else { // if it does not exist, insert it, then get the id
            let week = new Week({
                dayIds: dayIdArr
            })
            
            let insertedWeek = await week.save()
            weekId = insertedWeek.id 
        }
        
        
        // WEEK TO USER

        // days - at each index, has day, each day has an id (length of 7)
        // dayIdSet - an arry with the Ids in the right order (not necessarily have a length of 7)

        dayIdArr.sort()
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

