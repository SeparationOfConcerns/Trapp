
  


  // Run a request to create a new Fusion Table.
  function createTable() {
	var tableResource = [];
	tableResource.push('{');
	tableResource.push('"name": "People",');
	tableResource.push('"columns": [');
	tableResource.push('{ "name": "Name", "type": "STRING" },');
	tableResource.push('{ "name": "Age", "type": "NUMBER" }');
	tableResource.push('],')
	tableResource.push('"isExportable": true');
	tableResource.push('}');
	runClientRequest({
	  path: '/fusiontables/v1/tables',
	  body: tableResource.join(''),
	  method: 'POST'
	}, function(resp) {
	  var output = JSON.stringify(resp);
	  document.getElementById('create-table-output').innerHTML = output;
	  tableId = resp['tableId'];
	  document.getElementById('table-id-1').innerHTML = tableId;
	  document.getElementById('table-id-2').innerHTML = tableId;
	  document.getElementById('insert-data').disabled = false;
	  document.getElementById('select-data').disabled = false;
	  document.getElementById('create-table').disabled = true;
	});
  }

  // Run a request to INSERT data.
  function insertData() {
	var name = document.getElementById('name').value;
	var age = document.getElementById('age').value;
	var insert = [];
	insert.push('INSERT INTO ');
	insert.push(tableId);
	insert.push(' (Name, Age) VALUES (');
	insert.push("'" + name + "', ");
	insert.push(age);
	insert.push(')');
	query(insert.join(''));
  }

  // Run a request to SELECT data.
  function selectData() {
	query('SELECT * FROM ' + tableId);
  }

  // Send an SQL query to Fusion Tables.
  function query(query) {
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
  function runClientRequest(request, callback) {
	var restRequest = gapi.client.request(request);
	restRequest.execute(callback);
  }
