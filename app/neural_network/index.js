/**
 * Created by Denis Kalinichenko on 8/5/2016.
 */

var brain = require("brain.js");
var net = new brain.NeuralNetwork({hiddenLayers: [4]});

// 1 - prepare
// 2 - go
// 3 - do
// 4 - exam
// 5 - party
// 6 -  homework
// 7 - school

var data = [
    {input: [1, 4], output: { low: 0, medium: 0, high: 1 }},
    {input: [1, 4], output: { low: 0, medium: 0, high: 1 }},
    {input: [2, 5], output: { low: 1, medium: 0, high: 0 }},
    {input: [3, 6], output: { low: 0, medium: 1, high: 0 }},
    {input: [2, 7], output: { low: 0, medium: 0, high: 1 }}
];

net.train(data, {
    log: true
});

console.log(net.run([1, 4]));