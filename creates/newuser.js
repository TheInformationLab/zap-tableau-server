module.exports = {
  key: 'newUser',
  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'User',
  display: {
    label: 'Add User',
    description: 'Add a new Tableau Server User.',
		important: true
  },
  operation: {
    inputFields: [
      {key: 'username', required: true, type: 'string'},
      {key: 'siteRole', required: true, choices: { SiteAdministratorCreator: 'Site Administrator Creator', Creator: 'Creator', Viewer: 'Viewer' }, helpText: 'Choose a role for this new user'},
      {key: 'authSetting', required: false, choices: { ServerDefault: 'Server Default', SAML: 'SAML'}, helpText: 'Choose an authentication type for this new user'}
    ],
    perform: (z, bundle) => {
      const addUser = z.request({
        url: bundle.authData.serverUrl + "/api/"+bundle.authData.apiVersion + "/sites/" + bundle.authData.creds.site.id + "/users",
        method: 'POST',
        body: z.JSON.stringify({
          "user" : {
              "name" : bundle.inputData.username,
              "siteRole" : bundle.inputData.siteRole,
              "authSetting" : bundle.inputData.authSetting
          }
        })
      });
      return addUser.then((response) => {
        return z.JSON.parse(response.content).user;
      });
    },
    sample: {
      'user-id': "582724a9-0e7b-1234-b573-dbe1101db4d1",
      name: "tom",
      siteRole: 'Creator',
      authSetting: 'ServerDefault',
      externalAuthUserId: ''
    },

    // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
    // field definitions. The result will be used to augment the sample.
    // outputFields: () => { return []; }
    // Alternatively, a static field definition should be provided, to specify labels for the fields
    outputFields: [
      {key: 'id', label: 'User ID'},
      {key: 'name', label: 'Username'},
      {key: 'siteRole', label: 'Site Role'},
      {key: 'authSetting', label: 'Auth Setting'},
      {key: 'externalAuthUserId', label: 'External Auth User ID'}
    ]
  }
};
