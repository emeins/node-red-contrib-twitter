var Twitter = require('twitter');

var _internals = {};

_internals.favorite = function (payload, creds, cb) {

    var client = new Twitter({
      consumer_key: creds.consumer_key,
      consumer_secret: creds.consumer_secret,
      access_token_key: creds.access_token_key,
      access_token_secret: creds.access_token_secret
    });

    client.get('statuses/user_timeline', payload, function(error, user, response){
       cb(error, user);
    });

};


module.exports = function(RED) {
    'use strict';

    function Node(n) {

        RED.nodes.createNode(this,n);

        var node = this;

        this.on('input', function (msg) {

            var creds = RED.nodes.getNode(n.creds),
                payload = typeof msg.payload === 'object' ? msg.payload : {};

            var attrs = ['screen_name','include_rts'];
            for (var attr of attrs) {
                if (n[attr]) {
                    payload[attr] = n[attr];
                }
            }

            payload.id = payload.screen_name;

            _internals.favorite(payload, creds, function(err, result){

                msg.payload = result;
                node.log(err);
                node.log(JSON.stringify(result));
                node.send(msg);
            });
        });
    }

    RED.nodes.registerType('twitter-timeline', Node);
};
