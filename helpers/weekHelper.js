const Day = require("../models/Day")
const Week = require("../models/Week")
exports.addWeek = async (mileages, workoutOrExtras, exercises) => {
    console.log("Made it to addScheduleInput")
    try{

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
        return [insertedWeek, days]
        } 
    } catch(e){
        console.log(e)
    }
}