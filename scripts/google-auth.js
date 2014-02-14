
      // The clientId and apiKey are available at
      // https://code.google.com/apis/console. For more information, see
      // http://code.google.com/p/google-api-javascript-client/wiki/Authentication.
      var clientId = '750131638486-0ti5kb4p3k9se1c0k22cufpgoq28fqnr.apps.googleusercontent.com';
      var apiKey = 'AIzaSyAWmcasG5HhHxz_FDne5p2pG9Q6V48VgYM';

      var scopes = 'https://www.googleapis.com/auth/fusiontables';
      var tableId;

      // Initialize the client, set onclick listeners.
      function initialize() {
        gapi.client.setApiKey(apiKey);
        //document.getElementById('create-table').onclick = createTable;
        //document.getElementById('insert-data').onclick = insertData;
        //document.getElementById('select-data').onclick = selectData;
        window.setTimeout(function() { auth(true); }, 1);
      }

      // Run OAuth 2.0 authorization.
      function auth(immediate) {
        gapi.auth.authorize({
          client_id: clientId,
          scope: scopes,
          immediate: immediate
        }, handleAuthResult);
      }

      // Handle the results of the OAuth 2.0 flow.
      function handleAuthResult(authResult) {
		
        var authorizeButton = document.getElementById('authorize-button');
        //var createTableButton = document.getElementById('create-table');
        if (authResult) {
          authorizeButton.disabled = true;
		  window.location = 'observe.html'
          //createTableButton.disabled = false;
        } else {
          authorizeButton.disabled = false;
          authorizeButton.onclick = function() { auth(false); return false; };
        }
      }

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
    