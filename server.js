/********************************************************************************* 
* WEB700 – Assignment 04 
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students. 
* 
* Name: Sampavi Shanthakumar 
* Student ID: 147633234 
* Date: 18th July 2024
* 
* Online (Heroku) Link: ________________________________________________________ 
* 
********************************************************************************/

const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const collegeData = require("./modules/collegeData");
const path = require("path");

// Adding the static middleware to serve files from the directory named public
app.use(express.static(path.join(__dirname, 'public')));

// Adding body-parser middleware
app.use(express.urlencoded({ extended: true }));

// Route to handle the students data
app.get("/students",(req,res)=>{
    var course = req.query.course;
        if(course){
            collegeData.getStudentsByCourse(course).then((students) => {
                res.json(students);
            }).catch((err) => {
                res.json({message: "no results"});
            });
        }else{
            collegeData.getAllStudents().then((students) => {
                res.json(students);
            }).catch((err) => {
                res.json({message: "no results"});
            });
        }
    });

// Route to handle the tas data
app.get("/tas",(req,res)=>{
        collegeData.getTAs().then((managers) => {
            res.json(managers);
        }).catch((err) => {
            res.json({message: "no results"});
        });
    });

// Route to handle the courses data
app.get("/courses",(req,res)=>{
    collegeData.getCourses().then((courses) => {
        res.json(courses);
    }).catch((err) => {
        res.json({message: "no results"});
    });
});

// Route to handle the specific student by the student number
app.get("/student/:num",(req,res)=>{
    var studentNum = req.params.num;
    collegeData.getStudentByNum(studentNum).then((student) => {
        res.json(student);
    }).catch((err) => {
        res.json({message: "no results"});
    });
});

// Route to handle the home page
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname + "/views/home.html"));
});

// Route to handle the about page
app.get("/about",(req,res)=>{
    res.sendFile(path.join(__dirname + "/views/about.html"));
});

// Route to handle the htmlDemo page
app.get("/htmlDemo",(req,res)=>{
    res.sendFile(path.join(__dirname + "/views/htmlDemo.html"));
});

// Route to handle the addStudent page
app.get("/students/add",(req,res)=>{
    res.sendFile(path.join(__dirname + "/views/addStudent.html"));
});

app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body)
      .then(() => {
        res.redirect('/students');
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error adding student');
    });
});
  
// Error handling middleware
app.use((req,res)=>{
    res.status(404).send("Page Not THERE, Are you sure of the path?");
});

// setup http server to listen on HTTP_PORT
collegeData.initialize().then(() => {
    app.listen(HTTP_PORT,()=>{
        console.log("server listening on port:" + HTTP_PORT);
    });
}).catch((err) => {
        console.error("Failed to initialize the data", err);
});
    

