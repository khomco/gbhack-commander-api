var Validator = require('jsonschema').Validator;
var v = new Validator();

var serverDataSchema = {
    "id": "/COCData",
    "properties": {
        "name": {"type": "string"}
    },
    "required": ["name"]
}
var createServerSchema = {
    "id": "/COC",
    "type": "object",
    "properties": {
        "data": {"$ref": "/COCData"}
    },
    "required": ["data"]
}
v.addSchema(serverDataSchema, '/COCData');
var commandPayload = "";

module.exports = {

    setPayload: function(payload) {
        commandPayload = payload;
    },

    validate: function(callback) {
        console.log("Validating: " + JSON.stringify(commandPayload))
        callback(v.validate(commandPayload, createServerSchema));
    },

    transform: function(callback) {
        callback("IM TRANFORMING THE CREATE SERVER COMMAND");
    }
}