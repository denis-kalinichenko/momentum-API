/**
 * Created by Denis Kalinichenko on 8/4/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var pos = require('pos');
var Word = require('./dictionary');
var neural_network = require("../neural_network");

var TaskSchema = new Schema({
    name: {
        type: String,
        trim: true,
        stripHtmlTags: true,
        required: true
    },
    priority: {
        type: Number,
        min: 1,
        max: 3,
        default: 1
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    autoIndex: false
});

TaskSchema.virtual("tags").get(function () {
    var words = new pos.Lexer().lex(this.name);
    return new pos.Tagger().tag(words);
});

TaskSchema.virtual("keywords").get(function () {
    var keywords = [];
    this.tags.forEach(function (tag, index, array) {
        if (tag[1] === "NN" || tag[1] === "VB" || tag[1] === "NNP") {
            keywords.push(tag);
            var word = new Word();
            word.name = tag[0];
            word.pos = tag[1];

            word.save(function (err, obj) {
                if(err && err.code === 11000) {

                }
                tag.push(obj.id);
            });
        }
    });
    return keywords;
});

TaskSchema.methods.checkPriority = function (cb) {

    // TODO get data from neural network

    cb(null, this.keywords);
};

TaskSchema.pre("save", function (cb) {

    cb();
});


TaskSchema.plugin(autoIncrement.plugin, {model: 'Task', field: 'id', startAt: '1'});

module.exports = mongoose.model('Task', TaskSchema);