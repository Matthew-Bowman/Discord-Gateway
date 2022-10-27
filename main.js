// Require Packages
require('dotenv').config();
const https = require(`https`);
const WebSocket = require(`ws`);

// Declare Versions
const apiVersion = 9;
const gatewayVersion = 9;

// Declare Variables
const token = process.env.AUTH_TOKEN;
const url = `https://discord.com/api/v${apiVersion}/gateway`;

// PROMISE: Makes Request to API to Obtain WebSocket URL
const GetWebsocketURL = new Promise((resolve, reject) => {
  https.get(url, (res) => {
    let data = ``;

    // Data Chunk Received
    res.on(`data`, (chunk) => (data += chunk));

    // Response Finished
    res.on(`end`, () => {
      data = JSON.parse(data);
      if (data.url) resolve(data.url);
    });
  });
});

// Get the gateway url
GetWebsocketURL.then((url) => {
  // Construct full url
  const gatewayUrl = `${url}/?v=${gatewayVersion}&encoding=json`;

  // Open WebSocket connection
  connection = new WebSocket(gatewayUrl);

  connection.on(`message`, (msg) => {
    let decodedMsg = JSON.parse(msg.toString());
    console.log(decodedMsg);

    // if(decodedMsg.op != 0)
    console.log(decodedMsg);

    // Filter Received Op Codes
    switch (decodedMsg.op) {
      case 0:
        HandleEvent(connection, decodedMsg);
        break;
      case 1:
        break;
      case 7:
        break;
      case 9:
        break;
      case 10:
        InitiateHeartbeat(connection, decodedMsg);
        Identify(connection);
        break;
      case 11:
        break;
    }
  });
});

// METHOD: Sends a heartbeat to the gateway depending on the provided interval
function InitiateHeartbeat(connection, message) {
  let interval = message.d.heartbeat_interval;
  let seqNumber = message.s;

  let data = {
    op: 1,
    d: seqNumber,
  };

  setInterval(function () {
    connection.send(JSON.stringify(data));
  }, interval);
}

// METHOD: Identifies the connection to the API
function Identify(connection) {
  let data = {
    op: 2,
    d: {
      token: token,
      intents: 513,
      properties: {
        $os: "windows",
        $library: "my_library",
        $device: "my_library",
      },
    },
  };

  connection.send(JSON.stringify(data));
}

// METHOD: Closes the connection
function Close(connection) {
  let data = {
    op: 1000,
  };

  connection.send(JSON.stringify(data));
}

// METHOD: Handles events sent by the gateway
function HandleEvent(connection, payload) {
  let type = payload.t;
  
  // Handle Event
}

function SendMessage(channelId) {
  // Message Data
  let data = {
    content: "Hello!",
    tts: false,
    embeds: [],
  };

  // Request Options
  let options = {
    hostname: `discord.com`,
    port: 443,
    path: `/api/v${apiVersion}/channels/${channelId}/messages`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${token}`,
    },
  };

  // Send Message
  let request = https.request(options);
  request.write(JSON.stringify(data));
  request.end();
}
