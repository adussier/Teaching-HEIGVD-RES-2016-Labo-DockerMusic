// ------------------------------
// Description
// ------------------------------

/*
	Author : Amel Dussier

	This program simulates a musician.
	A required parameter is the type of instrument, which must be member of the INSTRUMENTS list.
	Periodically (SOUND_INTERVAL), a UDP datagram is send to the address MULTICAST_ADDRESS on port PORT.
	
	The payload is in JSON and has the following format :
	{
		uuid : <a uuid (version 4)>,
		instrument : <the instrument passed as parameter>,
		sound : <the sound made by the instrument (see INSTRUMENTS list)>
	}
*/ 


// ------------------------------
// Global variables
// ------------------------------

// for UDP
var dgram = require("dgram");

// for uuids
var uuid = require("uuid");

// the multicast IP address
const MULTICAST_ADDRESS = "239.255.3.5";

// the port
const PORT = "2204";

// the available instruments
const INSTRUMENTS = {
	piano : "ti-ta-ti",
	trumpet : "pouet",
	flute : "trulu",
	violin : "gzi-gzi",
	drum : "boum-boum"
};

// the interval between each sound
const SOUND_INTERVAL = 1000;

// create a new UDP socket
var socket = dgram.createSocket("udp4");

// create payload
var payload = {
	uuid : uuid.v4()
};


// ------------------------------
// Functions
// ------------------------------

// make a sound
function makeSound() {
	// convert payload to JSON
	var json = JSON.stringify(payload);
	
	// create buffer with json
	var buffer = new Buffer(json);
	
	// send buffer content
	socket.send(buffer, 0, buffer.length, PORT, MULTICAST_ADDRESS, function(err, bytes) {
		console.log("Sending payload : " + json);
	});
}


// ------------------------------
// Main
// ------------------------------

var instrument = process.argv[2];

// check if instrument exist
if (INSTRUMENTS[instrument] === undefined) {
	console.log('The instrument ' + instrument + ' is not defined.');
	process.exit(1);
}

// set instrument and sound
payload.instrument = instrument;
payload.sound = INSTRUMENTS[instrument];

// make sound periodically
setInterval(makeSound, SOUND_INTERVAL);