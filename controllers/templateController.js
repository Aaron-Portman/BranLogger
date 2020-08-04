const {addWeek, getWeek} = require("../helpers/weekHelper")
const Template = require("../models/Template")

exports.addTemplatePage= async (req,res) => {
    //GET
    let templates = await Template.find()
    res.locals.templates = templates
    res.render("addTemplate")
}

exports.addTemplate = async (req,res) => {
    //POST
    try{
        console.log("entered try")
        let weekAndDays = await addWeek(req.body.mileages, req.body.workoutOrExtras, req.body.exercises)
        let week = weekAndDays[0]
        let dayIdArr = week.dayIds.sort()
        let days = weekAndDays[1]
        // Creates Order Array
        let order = []
        for (let i = 0; i < days.length; i++) {
            let dayId = days[i].id 
            let dayIdIndex = dayIdArr.indexOf(dayId)
            order.push(dayIdIndex)
        }
        console.log("about to make template")
        console.log("name" , req.body.name)
        let template = new Template({
            name: req.body.name,
            weekId: week.id,
            dayOrder: order
        })
        await template.save()
        console.log("template made: ", this.addTemplatePage)
        res.json({
            success: true
        })
    } catch(e){
        console.log(e)
    }
}

exports.getTemplate = async (req,res) => {
    //GET
    try{
        let templateId = req.body.templateId
        let template = await Template.findById(templateId)
        console.log("Template: " ,template)
        let week = await getWeek(template.weekId, template.dayOrder)
        console.log("Week", week)
        res.json({week, templateName: template.name})
    } catch(e){
        console.log(e)
        res.json({
            success: false
        })
    }
}