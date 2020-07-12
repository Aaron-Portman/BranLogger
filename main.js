"use strict";

const express = require("express"),
    app = express(),
    homeController = require("./controllers/homeController"),
    errorController = require("./controllers/errorController"),
    enterEasyRunController = require("./controllers/enterEasyRunController"),
    enterWorkoutController = require("./controllers/enterWorkoutController"),
    enterCrossTrainController = require("./controllers/enterCrossTrainController"),
    scheduleInputController = require("./controllers/scheduleInputController"),
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
app.post("/addEasyRun", enterEasyRunController.postedEasyRunForm)
app.post("/addWorkout", enterWorkoutController.postedWorkoutForm)
app.post("/addCrossTrain", enterCrossTrainController.postedCrossTrainForm)
app.post("/addScheduleInput", scheduleInputController.addScheduleInput)

app.get("/easyRun", enterEasyRunController.easyRunPage)
app.get("/workout", enterWorkoutController.workoutPage)
app.get("/crossTrain", enterCrossTrainController.crossTrainPage)
app.get("/showLog/:id", homeController.showLog)
app.get("/inputSchedule", scheduleInputController.inputSchedule)

app.use(errorController.pageNotFoundError)
app.use(errorController.internalServerError)

app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
});