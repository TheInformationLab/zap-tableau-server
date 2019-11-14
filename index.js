const WorkbookpreviewimageSearch = require('./searches/workbook_preview_image');
const WorkbookSearch = require('./searches/workbook');
const ProjectResource = require('./resources/project');
const PublishworkbookCreate = require('./creates/publish_workbook');
const WorkbookTrigger = require('./triggers/workbook');
const authentication = require('./authentication');
const createNewUser = require('./creates/newuser');
const updateUser = require('./creates/updateuser');
const searchUsers = require('./searches/users');
const hydrators = require('./hydrators');

const includeSessionKeyHeader = (request, z, bundle) => {
  request.headers = request.headers || {};
  request.headers["Accept"] = "application/json";
  request.headers["Content-Type"] = "application/json";
  if (bundle.authData.creds && bundle.authData.creds.token) {
    request.headers['X-Tableau-Auth'] = bundle.authData.creds.token;
  }
  return request;
};

const sessionRefreshIf401 = (response, z, bundle) => {
  if (bundle.authData.creds) {
    if (response.status === 401) {
      throw new z.errors.RefreshAuthError(); // ask for a refresh & retry
    }
  }
  return response;
};


// We can roll up all our behaviors in an App.
const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication,

  // beforeRequest & afterResponse are optional hooks into the provided HTTP client
  beforeRequest: [
    includeSessionKeyHeader
  ],

  afterResponse: [
  ],

  hydrators: hydrators,

  // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
  resources: {
    [ProjectResource.key]: ProjectResource,
  },

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [WorkbookTrigger.key]: WorkbookTrigger,
  },

  // If you want your searches to show up, you better include it here!
  searches: {
    //[WorkbookpreviewimageSearch.key]: WorkbookpreviewimageSearch,
    [WorkbookSearch.key]: WorkbookSearch,
    [searchUsers.key]: searchUsers
  },

  // If you want your creates to show up, you better include it here!
  creates: {
    [PublishworkbookCreate.key]: PublishworkbookCreate,
    [createNewUser.key]: createNewUser,
    [updateUser.key]: updateUser
  }
};

// Finally, export the app.
module.exports = App;
