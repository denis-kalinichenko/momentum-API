/**
 * Created by Denis Kalinichenko on 8/5/2016.
 */

var Task = require('../models/task');
var express = require('express');
var router = express.Router();

router.route('/tasks')
    .post(function (req, res) {
        var task = new Task();
        task.name = req.body.name;

        task.save(function (err) {
            if (err)
                res.send(err);

            res.json({message: 'Task created!'});
        });
    })
    .get(function (req, res) {
        Task.find(function (err, tasks) {
            if (err)
                res.send(err);

            res.json(tasks);
        })
    });

router.route('/tasks/priority')
    .post(function (req, res) {
        var task = new Task();
        task.name = req.body.name;

        task.checkPriority(function (err, data) {
            if (err)
                res.send(err);

            res.json(data);
        })
    });

router.route('/tasks/:task_id')
    .get(function(req, res) {
        Task.find({ id: req.params.task_id }, function(err, task) {
            if (err)
                res.send(err);

            res.json(task);
        });
    });

module.exports = router;