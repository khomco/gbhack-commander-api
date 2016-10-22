var express = require('express');
var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    client = new kafka.Client(),
    producer = new Producer(client);
var registry = require('../registry/commands');
var router = express.Router();

router.post('/commands', function(req, res) {
    console.log("Received command: " + JSON.stringify(req.body))
    var command = registry.lookupCommand(req);
    if(command === undefined) {
        res.status(400).json({"message":"command was not accepted"})
    } else {
        command.validate(function(result) {
            if(result.errors.length > 0) {
                res.status(400)
                    .json({"message": "Command payload was invalid", "reason": JSON.stringify(result.errors)})
            } else {
                command.transform(function(data) {
                    var payloads = [
                        { topic: 'commands', messages: data, partition: 0 }
                    ];
                    producer.send(payloads, function(err, data) { });
                    res.status(200).json({"message":"success"});
                });
            }
        });
    }
});

module.exports = router;
