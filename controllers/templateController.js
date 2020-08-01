const {addWeek} = require("../helpers/weekHelper")
const Template = require("../models/Template")

exports.addTemplatePage= (req,res) => {
    res.render("addTemplate")
}

exports.addTemplate = async (req,res) => {
    try{
        let weekAndDays = await addWeek(req.body.mileages, req.body.workoutsOrExtras, req.body.exercises)
        let week = weekAndDays[0]
        let days = weekAndDays[1]
        // Creates Order Array
        let order = []
        for (let i = 0; i < days.length; i++) {
            let dayId = days[i].id 
            let dayIdIndex = dayIdArr.indexOf(dayId)
            order.push(dayIdIndex)
        }
        let template = new Template({
            name: req.body.name,
            weekId: week.weekId,
            dayOrder: order
        })
    } catch(e){
        console.log(e)
    }
}