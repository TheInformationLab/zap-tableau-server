const request = require('request');
const Promise = require("bluebird");

const FormData = require('form-data');

const hydrators = require('../hydrators');

const publishworkbook = (z, bundle) => {
  return new Promise(function (resolve) {

  z.console.log("Starting Publish");
  const { URL } = require('url');

  const url = `${bundle.authData.serverUrl}/api/${bundle.authData.apiVersion}/sites/${bundle.authData.creds.site.id}/workbooks?overwrite=${bundle.inputData.overwrite}`;
  z.console.log("Publising to", url);

  const servURL = new URL(url);
  const host = servURL.hostname;
  const path = servURL.pathname + servURL.search;
  z.console.log("Serv host", host, "Serv Path", path);

  if (servURL.port) {
    var servPort = servURL.port;
  } else if (servURL.protocol == "https:") {
    var servPort = 443;
  } else {
    var servPort = 80;
  }

  var form = new FormData();

  let workbookName = bundle.inputData.name;
  workbookName = workbookName.replace(/\\/g, '\\\\'); // escape backslashes
  workbookName = workbookName.replace(/'/g, "\\'");   // escape quotes
  let connStr = '';
  if (bundle.inputData.setConnections > 0) {
    connStr += '<connections>';
    for (let i = 0; i < bundle.inputData.setConnections; i += 1) {
      connStr += `<connection serverAddress="${bundle.inputData['connection'+i+'Address']}" serverPort="${bundle.inputData['connection'+i+'Port']}"><connectionCredentials name="${bundle.inputData['connection'+i+'Username']}" password="${bundle.inputData['connection'+i+'Password']}" embed="${bundle.inputData['connection'+i+'Embed']}" oAuth="${bundle.inputData['connection'+i+'Oauth']}" /></connection>`
    }
    connStr += '</connections>';
  }

  let reqPayload =  `<tsRequest><workbook name='${workbookName}' showTabs='${bundle.inputData.showTabs}'>${connStr}<project id='${bundle.inputData.projectId}' /></workbook></tsRequest>`;

  z.console.log("reqPayload", reqPayload);

  form.append('request_payload',reqPayload , {contentType: 'text/xml'});
  form.append('tableau_workbook', request(bundle.inputData.file),{contentType: 'application/octet-stream', filename: `${bundle.inputData.filename}.twbx`});
  z.console.log(form);
  form.submit(
      {
        protocol: servURL.protocol,
        host: host,
        port: servPort, // for proxy
        path: path,
        method: 'POST',
        headers: {
            'X-Tableau-Auth': bundle.authData.creds.token,
            'Content-Type': 'multipart/mixed; boundary=' + form.getBoundary(),
            'Accept' : 'application/json'
        }
    }, function(err, response) {
       var str = '';
        //another chunk of data has been recieved, so append it to `str`

        response.on('data', function (chunk) {
          str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
          resolve(z.JSON.parse(str));
        });
    });
  });
};

module.exports = {
  key: 'publish_workbook',
  noun: 'workbook',

  display: {
    label: 'Publish Workbook',
    description: 'Publishes a Tableau Workbook to Tableau Server or Tableau Online.'
  },

  operation: {
    inputFields: [
      {key: 'name', required: true, label: 'Workbook Name'},
      {key: 'projectId', required: true, label: 'Project', dynamic: 'projectList.id.name'},
      {key: 'filename', required: true, type: 'string', label: 'Filename', helpText: 'Set the workbook a filename, if your source is a Tableau Server then use the ContentUrl field'},
      {key: 'file', required: true, label: 'Tableau Workbook', type: 'file'},
      {key: 'overwrite', required: true, label: 'Overwrite Existing Workbook?', type: 'boolean'},
      {key: 'showTabs', required: false, label: 'Show views in tabs', type: 'boolean'},
      {key: 'setConnections', required: false, label: 'Number of Connections to Configure', choices: { 0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5' }, altersDynamicFields: true},
      function(z, bundle) {
        if (bundle.inputData.setConnections > 0) {
          let fields = [];
          for (let i = 0; i < bundle.inputData.setConnections; i += 1) {
            fields = fields.concat( [
              {key: `connection${i}Address`, required: true, label: `Connection ${i} Server Address`},
              {key: `connection${i}Port`, required: true, label: `Connection ${i} Server Port Number`},
              {key: `connection${i}Username`, required: false, label: `Connection ${i} Username`},
              {key: `connection${i}Password`, required: false, label: `Connection ${i} Password`, type: 'password'},
              {key: `connection${i}Embed`, required: false, label: `Connection ${i} Embed Credentials`, type: 'boolean'},
              {key: `connection${i}Oauth`, required: false, label: `Connection ${i} OAuth?`, type: 'boolean'}
            ] );
          }
          return fields;
        }
        return [];
      }
    ],
    perform: publishworkbook,

    sample: {
      workbook : {
        name: 'workbook-name',
        id: 'workbook-id',
        contentUrl: 'content-url',
        showTabs: 'show-tabs-flag',
        size: 'size-in-megabytes',
        createdAt: 'createdAt',
        updatedAt: 'datetime-updated'
      },
      project : {
        id: 'project-id'
      },
      owner : {
        id: 'owner-id'
      }
    },

    outputFields: [
      {key: 'workbook__name', label: 'Name'},
      {key: 'workbook__id', label: 'ID'},
      {key: 'workbook__contentUrl', label: 'Content URL'},
      {key: 'workbook__showTabs', label: 'Show Tabs'},
      {key: 'workbook__size', label: 'Size'},
      {key: 'workbook__createdAt', label: 'Created At'},
      {key: 'workbook__updatedAt', label: 'Updated At'},
      {key: 'project__id', label: 'Project ID'},
      {key: 'owner__id', label: 'Owner ID'}
    ]
  }
};
