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
        console.log(req.body.name);
        task.save(function (err) {
            if (err)
                res.send(err);

            res.json({message: 'Task created!'});
        });

    });

module.exports = router;