/**
 * Created by Denis Kalinichenko on 8/4/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var pos = require('pos');
var Word = require('./dictionary');
var neural_network = require("../neural_network");
var async = require('async');

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
        }
    });
    return keywords;
});

TaskSchema.methods.saveKeywords = function (cb) {
    var calls = [];
    var keywords  = this.keywords;

    keywords.forEach(function (keyword, index, array) {
        calls.push(function(callback) {
            var word = new Word();
            word.name = keyword[0];
            word.pos = keyword[1];

            word.save(function (err, _word) {
                if (err && err.code != 11000) {
                    return callback(err);
                }
                if (err && err.code === 11000) {
                    return Word.findOne({ name: keyword[0] }, function (err, _word) {
                        if (err)
                            return callback(err);
                        callback(null, _word);
                    });
                }
                callback(null, _word);
            });
        });
    });

    async.parallel(calls, function(err, result) {
        if (err)
            return cb(err);
        cb(null, result);
    });
};

TaskSchema.methods.checkPriority = function (cb) {
    this.saveKeywords(function (err, words) {
        if (err)
            return cb(err);
        // TODO get data from neural network
        cb(null, words);
    });
};

TaskSchema.pre("save", function (cb) {
    var task = this;
    task.saveKeywords(function (err, words) {
        var data = [];
        words.forEach(function (word, index, array) {
            var single_data = { input: word.id, output: { low: 0, medium: 0, high: 0 } };
            switch (task.priority) {
                case 1:
                    single_data.output.low = 1;
                    break;
                case 2:
                    single_data.output.medium = 1;
                    break;
                case 3:
                    single_data.output.high = 1;
                    break;
                default:
                    single_data.output.low = 1;
            }
            data.push(single_data);
        });
        console.log(data);
        neural_network.net.train(data, {log: true});
        cb();
    });
});


TaskSchema.plugin(autoIncrement.plugin, {model: 'Task', field: 'id', startAt: '1'});

module.exports = mongoose.model('Task', TaskSchema);