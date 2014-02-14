var tableId = '1RQO8PRIQtoeciDA9AIU6phr3TT7QkTbuhM_KwPo';

  // Run a request to INSERT a tree observation.
function insert(survey, latlong, date, tree, image, testnotes) 
{	
	var insert = [];
	insert.push('INSERT INTO ');
	insert.push(tableId);
	insert.push(' (Survey, Location, Date, Tree, Image, Observation) VALUES (');
	insert.push("'" + survey + "', ");
	insert.push("'" + latlong + "', ");
	insert.push("'" + date + "', ");
	insert.push("'" + tree + "', ");
	insert.push("'" + image + "', ");
	insert.push("'" + testnotes + "'");
	insert.push(')');
	query(insert.join(''));
}

  // Send an SQL query to Fusion Tables.
function query(query) 
{
	var lowerCaseQuery = query.toLowerCase();
	var path = '/fusiontables/v1/query';
	var callback = function(element) {
	  return function(resp) {
		var output = JSON.stringify(resp);
		document.getElementById(element).innerHTML = output;
	  };
	}
	if (lowerCaseQuery.indexOf('select') != 0 &&
		lowerCaseQuery.indexOf('show') != 0 &&
		lowerCaseQuery.indexOf('describe') != 0) {

	  var body = 'sql=' + encodeURIComponent(query);
	  runClientRequest({
		path: path,
		body: body,
		headers: {
		  'Content-Type': 'application/x-www-form-urlencoded',
		  'Content-Length': body.length
		},
		method: 'POST'
	  }, callback('insert-data-output'));

	} else {
	  runClientRequest({
		path: path,
		params: { 'sql': query }
	  }, callback('select-data-output'));
	}
}

  // Execute the client request.
function runClientRequest(request, callback) 
{
	var restRequest = gapi.client.request(request);
	restRequest.execute(callback);
}

function getUserName()
{
	
	// This sample assumes a client object has been created.
	// To learn more about creating a client, check out the starter:
	//  https://developers.google.com/+/quickstart/javascript
	gapi.client.load('plus','v1', function(){
												var request = gapi.client.plus.people.get({
												'userId': 'me'
												});
												request.execute(function(resp) {
																					displayUserName(resp.displayName, resp.image.url);
																				});
											});
}

function displayUserName(username, srcurl)
{
	document.getElementById("username").innerHTML = username + "<img id='userimg'/>";
	document.getElementById("userimg").src = srcurl;
}