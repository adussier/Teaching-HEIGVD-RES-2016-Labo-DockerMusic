// ------------------------------
// Description
// ------------------------------

/*
	Author : Amel Dussier & Sarra Berich

	This program simulates someone who listens to an orchestra.
	The musicians in the orchestra can send their sounds in JSON format to the address MULTICAST_ADDRESS on port UDP_PORT.
	
	The payload should be in JSON and having the following format :
	{
		uuid : <a uuid (version 4)>,
		instrument : <an instrument name>,
		sound : <the sound made by the instrument>
	}
	
	A list of all active musicians will be stored by the program.
	Periodically (CLEAN_INTERVAL), all inactive musicians (based on their uuid, and the MAX_INACTIVITY value) will be removed from the list.
	
	The program also responds on the TCP port TCP_PORT, with the current active musicians list.
*/ 


// ------------------------------
// Global variables
// ------------------------------

// for UDP
var dgram = require("dgram");

// for TCP
var net = require("net");

// the multicast IP address
const MULTICAST_ADDRESS = "239.255.3.5";

// the UDP port
const UDP_PORT = "2204";

// the TCP port
const TCP_PORT = "2205";

// creates the udp server
var udpSocket = dgram.createSocket("udp4");

// create TCP listening socket
var tcpSocket = net.createServer(function(socket) {
	
	// on connection, send the list of musicians
	var message = JSON.stringify(musicians);
	socket.end(message);
});

// the list of musicians
var musicians = [];

// the interval between each clean of the musician list
const CLEAN_INTERVAL = 1000;

// the maximal inactivity time before a musician is removed from the list
const MAX_INACTIVITY = 5000;


// ------------------------------
// Functions
// ------------------------------

function cleanInactiveMusicians() {
	
	// get current time
	var now = new Date();
	
	// process musicians list
	var i = musicians.length
	while (i--) {
		// if inactivity limit reached
		if(now - musicians[i].activeSince > MAX_INACTIVITY) {
			// remove from the list
			console.log('Removing inactive musician : ' + musicians[i].uuid);
			musicians.splice(i, 1);
		}
	}
	
	// set timeout for next clean
	setTimeout(cleanInactiveMusicians, CLEAN_INTERVAL);
}

// ------------------------------
// Callbacks
// ------------------------------

// when the UDP socket is starting listening
udpSocket.on("listening", function () {
	console.log("Listening for UDP datagrams on port : " + udpSocket.address().port);
});

// when recieving a UDP message
udpSocket.on("message", function (msg, source) {
	console.log('New message : ' + msg);
	
	// get message payload
	var payload = JSON.parse(msg);
	
	// update musician if already in list
	for (var i = 0; i < musicians.length; i++) {
		if (musicians[i].uuid == payload.uuid) {
			// update last seen
			musicians[i].activeSince = new Date();
			return;
		}
	}
	
	// add musician to list
	payload.activeSince = new Date();
	musicians.push(payload);
});

// when the TCP socket is starting listening
tcpSocket.on("listening", function () {
	console.log("Listening for TCP segments on port : " + tcpSocket.address().port);
});


// ------------------------------
// Main
// ------------------------------

// binds the UDP socket
udpSocket.bind(UDP_PORT, function() {
	// listen multicast address
	udpSocket.addMembership(MULTICAST_ADDRESS);
});

// start listening on TCP socket
tcpSocket.listen(TCP_PORT, "0.0.0.0");

// clean inactive musicians periodically
setTimeout(cleanInactiveMusicians, CLEAN_INTERVAL);