var Promise = require("bluebird");

var loopUsers = function(z, bundle, callback, page, users) {
  var reqUrl = bundle.authData.serverUrl + "/api/"+bundle.authData.apiVersion + "/sites/" + bundle.authData.creds.site.id + "/users"
  if (page) {
    reqUrl = reqUrl + "?pageNumber=" + page;
  }
  var req = z.request({
    url: reqUrl
  });
  req.then((response) => {
    var content = z.JSON.parse(response.content);
    if (!content) {
      z.console.log("Error getting users");
      return;
    }
    if (!users) {
      var users = [];
    }
    users = users.concat(content.users.user);
    if (users.length == parseInt(content.pagination.totalAvailable)) {
      callback(users);
    } else {
      if (!page) {
        var page = 1;
      }
      loopUsers(z, bundle, callback, page + 1, users);
    }
  });
}

var getUsers = function (z, bundle) {
  return new Promise(function (resolve) {
    loopUsers(z, bundle, function(users) {
      resolve(users);
    });
  });
};

module.exports = {
  key: 'users',
  noun: 'Users',
  display: { label: 'Get Users on Site', description: 'Returns the users associated with the specified site.' },
  operation:
  {
    inputFields: [
      {key: 'username', required: false, type: 'string'}
    ],
    perform: (z, bundle) => {
      return getUsers(z, bundle).then((users) => {
        return users;
      });
    },
    sample:
    {
      id: "9f9e9d9c8-b8a8-f8e7-d7c7-b7a6f6d6e6d",
      name: "Tom Brown",
      siteRole: "ServerAdministrator",
      lastLogin : "2018-11-28 13:00:00",
      externalAuthUserId: "",
      authSetting: "ServerDefault"
    },
    outputFields: [
      {key: 'id', label: 'User ID'},
      {key: 'name', label: 'Username'},
      {key: 'siteRole', label: 'Site Role'},
      {key: 'lastLogin', label: 'Timestamp of last user login'},
      {key: 'externalAuthUserId', label: 'External Auth User ID'},
      {key: 'authSetting', label: 'Auth Setting'}
    ]
  }
}
