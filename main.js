"use strict";

const express = require("express"),
  app = express(),
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController"),
  layouts = require("express-ejs-layouts");

  const authRouter = require('./routes/authentication');
  const isLoggedIn = authRouter.isLoggedIn

const mongoose = require("mongoose");
mongoose.connect(
    'mongodb://localhost/branlogger',
     {useNewUrlParser:true, useUnifiedTopology: true})
const db = mongoose.connection;


app.set("view engine", "ejs");
//app.set("views", "./views")
app.set("port", process.env.PORT || 3000);
app.use(
express.urlencoded({
    extended: false
})
);

app.use(express.json());
app.use(layouts);
app.use(express.static("public"));
app.use(authRouter)


/*app.get("/", (req, res) => {
  res.render("index");
});
*/
app.get("/", homeController.homeScreen)
//app.post("/", homeController.homeScreen)
app.post("/addEasyRun", homeController.postedEasyRunForm)
app.post("/addWorkout", homeController.postedWorkoutForm)
app.post("/addCrossTrain", homeController.postedCrossTrainForm)
app.get("/easyRun", homeController.easyRunPage)
app.get("/workout", homeController.workoutPage)
app.get("/crossTrain", homeController.crossTrainPage)
app.get("/showLog/:id", homeController.showLog)

/*
app.get("/log", (req, res) => {
    res.render("log");
})
app.get("/easyRun", (req, res) => {
    res.render("easyRun");
})
app.get("/workout", (req, res) => {
    res.render("workout");
})
*/

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
  });