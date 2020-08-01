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
    'mongodb://localhost/branlogger',
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

app.get("/easyRun", easyRunController.easyRunPage)
app.get("/workout", workoutController.workoutPage)
app.get("/crossTrain", crossTrainController.crossTrainPage)
app.get("/showLog/:id", homeController.showLog)
app.get("/inputSchedule", scheduleInputController.inputSchedule)
app.get("/addTemplate", templateController.addTemplatePage)

app.use(errorController.pageNotFoundError)
app.use(errorController.internalServerError)

app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
});