/**
 * Created by Denis Kalinichenko on 8/4/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var TaskSchema = new Schema({
    name: String
});

TaskSchema.plugin(autoIncrement.plugin, {model: 'Task', field: 'id', startAt: '1'});

module.exports = mongoose.model('Task', TaskSchema);