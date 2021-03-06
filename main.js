"use strict";
if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
const express = require("express"),
    app = express(),
    homeController = require("./controllers/homeController"),
    errorController = require("./controllers/errorController"),
    easyRunController = require("./controllers/easyRunController"),
    workoutController = require("./controllers/workoutController"),
    crossTrainController = require("./controllers/crossTrainController"),
    scheduleInputController = require("./controllers/scheduleInputController"),
    templateController = require("./controllers/templateController"),
    layouts = require("express-ejs-layouts");

    const authRouter = require('./routes/authentication');
    const isLoggedIn = authRouter.isLoggedIn

const mongoose = require("mongoose")
mongoose.connect(
    process.env.MONGO_URI,
    {useNewUrlParser:true, useUnifiedTopology: true
})

const db = mongoose.connection;

app.set("view engine", "ejs");
//app.set("views", "./views")
app.set("port", process.env.PORT || 3000);
app.use(
    express.urlencoded({
        extended: false
    })
);

//trying to force login
// app.use((req, res, next) => {
//     if(req.originalUrl === "/"){
//         next()
//     }
//     if (req._userId === null || req._userId === undefined || req._userId === "") {
//         res.redirect("/login")
//     }
//     next()
    
// });

app.use(express.json())
app.use(layouts)
app.use(express.static("public"))
app.use(authRouter)

app.get("/", homeController.homeScreen)
//app.post("/", homeController.homeScreen)
app.post("/addEasyRun", easyRunController.postedEasyRunForm)
app.post("/addWorkout", workoutController.postedWorkoutForm)
app.post("/addCrossTrain", crossTrainController.postedCrossTrainForm)
app.post("/addScheduleInput", scheduleInputController.addScheduleInput)
app.post("/addTemplate", templateController.addTemplate)
app.post("/getTemplate", templateController.getTemplate)

app.get("/easyRun", easyRunController.easyRunPage)
app.get("/workout", workoutController.workoutPage)
app.get("/crossTrain", crossTrainController.crossTrainPage)
app.get("/showLog/:id", homeController.showLog)
app.get("/inputSchedule", scheduleInputController.inputSchedule)
app.get("/addTemplate", templateController.addTemplatePage)


//app.get("/viewTemplate", templateController.viewTemplatePage)



// app.use(errorController.pageNotFoundError)
// app.use(errorController.internalServerError)

app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
});