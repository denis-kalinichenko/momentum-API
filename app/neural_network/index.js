/**
 * Created by Denis Kalinichenko on 8/5/2016.
 */

var brain = require("brain.js");
var net = new brain.NeuralNetwork();

var trainStream = net.createTrainStream({
    doneTrainingCallback: function (obj) {
        console.log('trained in ' + obj.iterations + ' iterations with error: '
            + obj.error);
    }
});

module.exports = {
    trainNetwork: function (data) {
        for (var i = 0; i < data.length; i++) {
            trainStream.write(data[i]);
        }
    },
    net: net
};