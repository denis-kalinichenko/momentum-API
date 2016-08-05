/**
 * Created by Denis Kalinichenko on 8/5/2016.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var WordSchema = new Schema({
    name: {
        type: String,
        trim: true,
        stripHtmlTags: true,
        required: true,
        index: { unique: true },
        dropDups: true
    },
    pos: {
        type: String,
        trim: true,
        stripHtmlTags: true,
        required: true
    }
}, {
    collection: 'dictionary'
});

WordSchema.plugin(autoIncrement.plugin, {model: 'Word', field: 'id', startAt: '1'});

module.exports = mongoose.model('Word', WordSchema);