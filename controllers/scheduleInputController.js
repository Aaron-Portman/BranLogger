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
    try{
        let dates = req.body['date[]']
        let mileages = req.body['mileage[]']
        let workoutOrExtras = req.body['workoutOrExtra[]']
        let exercises = req.body['exercise[]']
        // let selectedUsers = req.body['selectedUsersToApply[]']
        let userIDs = req.body['userIDs[]'] // same length as selected
        let selected = req.body['selected[]'] // same length as userIDs - array of 0s and 1s (as Strings)

        // Trim All User Input
        for (let i = 0; i < mileages.length; i++) {
            mileages[i] = mileages[i].trim()
            workoutOrExtras[i] = workoutOrExtras[i].trim()
            exercises[i] = exercises[i].trim()
        }

        let userHasBeenSelected = false
        for (let i = 0; i < selected.length; i++)
            if (selected[i] == '1') userHasBeenSelected = true;

       // trying to save selected users to apply schedule to
       if (userHasBeenSelected) {
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
   
           // Adding Week For Each Sser 
           for (let i = 0; i < selected.length; i++) {
               let isSelected = selected[i]
   
               if (isSelected == '1') {
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
           }
   
           res.json({ 
               message: 'Success',
               messageCode: 1,
           })
           
        } else {
               res.json({ 
                   message: 'No User Selected',
                   messageCode: 2,
               })

       }


        
        // let days = []
        // for (let i = 0; i < dates.length; i++) {
        //     let d = new Date(dates[i])
        //     let day = { 
        //         mileage: mileages[i],
        //         exercise: exercises[i],
        //         workoutOrExtra: workoutOrExtras[i],
        //         year: d.getFullYear(),
        //         month: d.getMonth() + 1,
        //         day: d.getDate() + 1,
        //         dayOfWeek: d.getDay() + 1,
        //     }
        //     days.push(day)
        // }
        // let newWeek = new Week({
        //     // userId: ObjectId,
        //     days,
        //     // startYear: days[0].year,
        //     // startMonth: days[0].month,
        //     // startDay: days[0].day,
        // })
        // newWeek.save().then((week) => {
        //     let monday = new Date()
        //     let today = monday.getDay()
        //     let distanceToMonday
        //     if (today != 0) {
        //         distanceToMonday = today - 1
        //     } else {
        //         distanceToMonday = 6
        //     }
        //     monday.setDate(monday.getDate() - distanceToMonday)

        //     console.log(week)
        //     // console.log("SELECTED" ,selected)
        //     for (let i = 0; i < userIDs.length; i++) {
        //         if (selected[i] == "1") {
        //             let weekToUser = new WeekToUser({
        //                 userId: userIDs[i],
        //                 weekId: week.id,
        //                 year: monday.getFullYear(),
        //                 month: monday.getMonth() + 1,
        //                 day: monday.getDate(),
        //             })
        //             weekToUser.save().then((wtu)=>{
        //                 console.log(wtu) 
        //             })   
        //         }
        //     }
        // })
        
    } catch(e) {
        next(e)
    }
}

