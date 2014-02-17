// get a handle on the html element that will hold the 
// GPS coordinates and the maps of the users location

// to use this script without changing it you will need
// two divs on your page with the ids "gps" and "map"

var gps = document.getElementById("gps");
var map = document.getElementById("map");
var mapWidth = 292;
var mapHeight = 200;
var mapZoom = 16;
var latlon = "";

function getLocation()
{
	// enableHighAccuracy asks the device to return a more accurate GPS location
	// even if it is at the cost of battery life or slower response times
	// maximumAge is the oldest cached GPS location the phone is allowed return instead of // getting a new one (ms)
	// timeout is how long the function is allowed wait for the device to respond
	var options = { enableHighAccuracy: true, maximumAge: 100, timeout: 60000 };
	
	// inform the user that something is happening
	gps.innerHTML = "Retrieving location from device...";
	
	// if the current device supports GPS location
	if( navigator.geolocation) 
	{
		// create a variable that contains a function (watchPosition) that asks the
		// device for the current GPS position of the device. If the position is found the
		// function gotPos will be called, otherwise the function gotErr will be called,
		// note that the options from the top of this function are now passed in
		var watchID = navigator.geolocation.watchPosition(gotPos, gotErr, options );
		
		// now that we have the watchPosition function in a variable pass that variable
		// to the JS setTimeout function that will cause the watchPosition function to be 
		// called every 5000 milliseconds
		var timeout = setTimeout( function() { navigator.geolocation.clearWatch( watchID ); }, 5000 );
	} 
	else 
	{
		// if the device does not support GPS location then tell the user
		gps.innerHTML = "Geolocation is not supported by this browser.";
	}
}
 
function gotPos(position)
{
	// grab the GPS co-ordnates from the position object
	var latlon = position.coords.latitude + "," + position.coords.longitude;

	// grab a Google Map centered at the co-ordinates above
	var img_url = "http://maps.googleapis.com/maps/api/staticmap?center="
	+latlon+"&zoom="+mapZoom+"&size="+mapWidth+"x"+mapHeight+"&sensor=false";

	// update the user interface with the map received above
	map.innerHTML = "<img src='"+img_url+"'>";
	
	// update the user interface with the co-ordinates received above (rounded)
	gps.innerHTML = "Lat: " + (Math.round(position.coords.latitude * 100000) / 100000) + 
	", Lon: " + (Math.round(position.coords.longitude * 100000) / 100000); 
}

function gotErr(error)
{
	// if the device returned an error when we looked for GPS co-ordinates then
	// decide what type of error it is an update the user interface with the details
	switch(error.code) 
	{
		case error.PERMISSION_DENIED:
			gps.innerHTML = "TURN ON GPS"
			break;
		case error.POSITION_UNAVAILABLE:
			gps.innerHTML = "GPS NOT AVAILABLE"
			break;
		case error.TIMEOUT:
			gps.innerHTML = "GPS TIMED OUT"
			break;
		case error.UNKNOWN_ERROR:
			gps.innerHTML = "GPS ERROR"
			break;
	}
}