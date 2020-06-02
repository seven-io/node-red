node-red-contrib-sms-sms77
===========================

<a href="http://nodered.org" target="_new">Node-RED</a> node to send SMS/Text2Speech message(s) via the Sms77 SMS gateway.


Install
-------

Run the following command in your Node-RED user directory - typically `~/.node-red`

    npm install node-red-contrib-sms-sms77

Properties
----------

- **Message** The text to be sent. Defaults to msg.payload if not set.
- **Number(s)** A comma separated list of mobile numbers. Defaults to msg.topic if not set.
- **Delay** Date/Timestamp for delayed dispatch. Accepts an UNIX timestamp or a date of format yyyy-mm-dd hh:ii eg. 1141511104 or 2016-03-04 23:25:04.
