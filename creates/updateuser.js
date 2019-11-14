module.exports = {
  key: 'updateUser',
  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'User',
  display: {
    label: 'Update User',
    description: 'Update the details and credentials of a user.'
  },

  operation: {
    inputFields: [
      {key: 'userId', required: true, type: 'string', helpText: "The ID of the user to update"},
      {key: 'fullName', required: false, type: 'string'},
      {key: 'email', required: false, type: 'string'},
      {key: 'password', required: false, type: 'string'},
      {key: 'siteRole', required: false, choices: { ServerAdministrator: 'Server Administrator', SiteAdministratorCreator: 'Site Administrator Creator', SiteAdministratorExplorer: 'Site Administrator Explorer', Creator: 'Creator',  ExplorerCanPublish: "Explorer (can publish)", Explorer: "Explorer", Viewer: 'Viewer', Unlicensed: 'Unlicensed' }, helpText: 'Update user role'},
      {key: 'authSetting', required: false, choices: { ServerDefault: 'Server Default', SAML: 'SAML'}, helpText: 'Update the user authentication type'}
    ],
    perform: (z, bundle) => {
      const updateUser = z.request({
        url: bundle.authData.serverUrl + "/api/"+bundle.authData.apiVersion + "/sites/" + bundle.authData.creds.site.id + "/users/" + bundle.inputData.userId,
        method: 'PUT',
        body: z.JSON.stringify({
          "user" : {
              "fullName" : bundle.inputData.fullName,
              "email" : bundle.inputData.email,
              "password": bundle.inputData.password,
              "siteRole" : bundle.inputData.siteRole,
              "authSetting" : bundle.inputData.authSetting
          }
        })
      });
      return updateUser.then((response) => {
        z.console.log(response.content)
        return z.JSON.parse(response.content).user;
      });
    },
    sample: {
      name: "tom.brown",
      fullName: "Tom Brown",
      email: "info@theinformationlab.co.uk",
      siteRole: 'Creator',
      authSetting: 'ServerDefault',
      externalAuthUserId: ''
    },

    // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
    // field definitions. The result will be used to augment the sample.
    // outputFields: () => { return []; }
    // Alternatively, a static field definition should be provided, to specify labels for the fields
    outputFields: [
      {key: 'name', label: 'Username'},
      {key: 'fullName', label: 'Full Name'},
      {key: 'email', label: 'Email'},
      {key: 'siteRole', label: 'Site Role'},
      {key: 'authSetting', label: 'Auth Setting'},
      {key: 'externalAuthUserId', label: 'External Auth User ID'}
    ]
  }
};
