/*
=====================================================
; Title: Web 450 nodebucket
; Author: Professor Krasso
; Date 21 November 2021
; Modified By: Jourdan Neal
; Description: Deployment, completed project. Tasks can be created by the user
; from there moved between To Do, Doing and Done columns. Tasks can be deleted
; by selecting the trash can icon. Tasks can also be re-arranged within each column.
; Users sign in and the signed in under the profile icon.
=====================================================
*/
/**
 * Require statements
 */
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const Employee = require('../src/app/models/employee');
const { requiredPaths } = require('../src/app/models/item');
const { findById } = require('../src/app/models/employee');
const { Router } = require('express');
const { builtinModules } = require('module');




/**
 * App configurations
 */
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': true}));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../dist/nodebucket')));
app.use('/', express.static(path.join(__dirname, '../dist/nodebucket')));

/**
 * Variables
 */
const PORT = process.env.PORT || 3000; // server port

app.set("port", PORT);

// Connect to MongoDB Database: nodebucket
const conn = 'mongodb+srv://admin:topsecret@cluster0.cs04f.mongodb.net/nodebucket?retryWrites=true&w=majority';

/**
 * Database connection
 */
mongoose.connect(conn, {
  promiseLibrary: require('bluebird'),
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => {
  console.debug(`Connection to the database instance was successful`);
}).catch(err => {
  console.log(`MongoDB Error: ${err.message}`)
}); // end mongoose connection

/**
 * API(s) go here...
 */
app.get('/api/employees/:empId', async(req, res) => {
  try {
    Employee.findOne({ 'empId': req.params.empId}, function(err, employee) {
      if (err) {
        console.log(err);
        res.status(500).send({
          'message': 'Internal server error!'
        })
      } else {
        console.log(employee);
        res.json(employee);
      }
    })
  } catch(e) {
    console.log(e);
    res.status(500).send({
      'message':'Internal server error!'
    })
  }
});

//findAllTasks API
app.get('/api/employees/:empId/tasks', async(req, res) => {
  try {
    //FindOne from params: empId, and respond with the empId, todo, and done portion of the Employee model.
    Employee.findOne({'empId': req.params.empId}, 'empId todo done doing', function(err, employee) {
      if (err) {
        console.log(err);
        res.status(500).send({
          'message': 'Internal server error!'
        })
      } else {
        console.log(employee);
        res.json(employee);
      }
    })
  } catch(e) {
    console.log(e);
    res.status(500).send({
      'message': 'Internal server error!'
    })
  }
});
//-----------------------------------------------------------//

//createTask API
app.post('/api/employees/:empId/tasks', async(req,res) => {
  try {
    Employee.findOne({'empId': req.params.empId}, function(err, employee) {
      //If error return status 500 with Internal server error message.
      if (err) {
        console.log(err);
        res.status(500).send({
          'message' : 'Internal server error!'
        })
      }
      else {
        console.log(employee);

        //create newItem variable
        const newItem = {
          //Reference the text variable in the item module.
          text: req.body.text
        }

        //Push the newItem to the employee todo
        employee.todo.push(newItem);

        //Save updatedEmployee with the newItem variable that was added above.
        employee.save(function(err, updatedEmployee) {
          if (err) {
            console.log(err);
            res.status(500).send ({
              'message' : 'Internal server error!'
            })
          } else {
            console.log(updatedEmployee);
            res.json(updatedEmployee);
          }
        })
      }
    })
  } catch(e){
    console.log(e);
    res.status(500). send({
      'message': 'Internal server error!'
    })
  }
});

//----------------------------------------------//
//--updateTask API--//
app.put('/api/employees/:empId/tasks', async(req,res) => {
  try {
    Employee.findOne({'empId': req.params.empId}, function(err, employee) {
      if (err){
        console.log(err);
        res.status(500).send({
          'message': 'Internal server error!'
        })
      } else {
        console.log(employee);

        employee.set({
          todo: req.body.todo,
          done: req.body.done,
          doing: req.body.doing,
        });

        employee.save(function(err, updatedEmployee) {
          if (err) {
            console.log(err);
            res.status(500).send({
              'message': 'Internal server error!'
            })
          } else {
            console.log(updatedEmployee);
            res.status(200).send({
              'message': 'Employee Updated!'
            })
          }
        })
      }
    })
  }
  catch (e){
    console.log(e);
    res.status(500).send({
      'message': 'Internal server error!'
    })
  }
})

//-----------------------------------------------------------//
// deleteTask API-- 1. find employee, 2. find tasks associated with employee (sub document), 3. .remove() todo/done task
app.delete('/api/employees/:empId/tasks/:taskId', async(req,res) => {
  //Try/catch bock
  try{
        //Find one and delete task by taskId
        Employee.findOne({'empId': req.params.empId}, function(err,employee) {
          if(err){
            console.log(err);
            res.status(500).send({
              'message':'Internal server error.'
            })
          } else {
            //Create const todo Items, look at employee documents to find the taskId.
            const todoItem = employee.todo.find(item => item._id.toString() === req.params.taskId);
            //Looking for the same items by Id this time in done status.
            const doneItem = employee.done.find(item => item._id.toString() === req.params.taskId);
            //Looking for the same items by Id this time in done status.
            const doingItem = employee.doing.find(item => item._id.toString() === req.params.taskId);

    if (todoItem){
      employee.todo.id(todoItem._id).remove();

      employee.save(function(err, updatedToDoItemEmployee)
      {
        if(err) {
          console.log(err);
          res.status(500).send({
            'message': 'Internal server error!'
          })
        } else {
          console.log(updatedToDoItemEmployee);
          res.status(200).send({
            'message': 'To Do task deleted.'
          })
        }
      })
    } else if (doneItem) {
      employee.done.id(doneItem._id).remove();

      employee.save(function(err, updatedDoneEmployee)
      {
        if(err) {
          console.log(err);
          res.status(500).send({
            'message': 'Internal server error.'
          })
        } else {
          console.log(updatedDoneEmployee);
          res.status(200).send({
            'message':'Done task deleted.'
          })
        }
      })
    } else if (doingItem) {
      employee.doing.id(doingItem._id).remove();

      employee.save(function(err, updatedDoingEmployee)
      {
        if(err) {
          console.log(err);
          res.status(500).send({
            'message': 'Internal server error.'
          })
        } else {
          console.log(updatedDoingEmployee);
          res.status(200).send({
            'message': 'Doing task deleted.'
          })
        }
      })
    } else {
      console.log('Invalid Task Id:' + req.params.taskId);
      res.status(300).send({
        'message': 'Task not found.'})
      }
    }
  })
}
catch(e){
  console.log(e);
  res.status(200).send({
    'message':'Internal server error!'
  })
}
})
//----------------------------------------------//
/**
 * Create and start server
 */
http.createServer(app).listen(port, function() {
  console.log(`Application started and listening on port: ${port}`)
}); // end http create server function
