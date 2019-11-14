// get a single project
const getProject = (z, bundle) => {
  const responsePromise = z.request({
    url: `${bundle.authData.serverUrl}/api/${bundle.authData.apiVersion}/sites/${bundle.authData.creds.site.id}/projects`,
    params: {
      filter: `name:eq:${bundle.inputData.name}`
    }
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content).projects.project);
};

// get a list of projects
const listProjects = (z, bundle) => {
  const responsePromise = z.request({
    url: `${bundle.authData.serverUrl}/api/${bundle.authData.apiVersion}/sites/${bundle.authData.creds.site.id}/projects`,
    params: {
      pageSize : 100,
      sort: 'updatedAt:desc',
      pageNumber : bundle.meta.page + 1
    }
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content).projects.project);
};

// create a project
const createProject = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: `${bundle.authData.serverUrl}/api/${bundle.authData.apiVersion}/sites/${bundle.authData.creds.site.id}/projects`,
    body: z.JSON.stringify({
      "project" : {
          "parentProjectId" : bundle.inputData.parentProject,
          "name" : bundle.inputData.name,
          "description" : bundle.inputData.description,
          "contentPermissions" : bundle.inputData.contentPermissions
      }
    })
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content).project);
};

module.exports = {
  key: 'project',
  noun: 'Project',

  get: {
    display: {
      label: 'Get Project',
      description: 'Gets a project.'
    },
    operation: {
      inputFields: [
        {key: 'name', required: true}
      ],
      perform: getProject
    }
  },

  list: {
    display: {
      label: 'New Project',
      description: 'Lists the projects.'
    },
    operation: {
      canPaginate: true,
      perform: listProjects
    }
  },

  create: {
    display: {
      label: 'Create Project',
      description: 'Creates a new project.'
    },
    operation: {
      inputFields: [
        {key: 'parentProject', required: false, label: 'Parent Project', dynamic: 'projectList.id.name'},
        {key: 'name', required: true, label: "Project Name", type: 'string'},
        {key: 'description', required: false, label: "Description", type: 'text'},
        {key: 'contentPermissions', required: false, choices: {LockedToProject: 'Locked to project', ManagedByOwner: 'Managed by owner'}}
      ],
      perform: createProject
    },
  },

  sample: {
    owner: {
      id: "32ac7b2f-ba3c-41e7-90e5-dca6ca66b8fb"
    },
    id: "224a64ce-fad5-11e3-83c4-a32ad25bb5ca",
    name: "Default",
    description: "",
    createdAt: "2010-10-28T21:11:20Z",
    updatedAt: "2018-12-11T14:31:17Z",
    contentPermissions: "ManagedByOwner"
  },
  outputFields: [
    {key: 'owner__id', label: 'ID'},
    {key: 'id', label: 'ID'},
    {key: 'name', label: 'Name'},
    {key: 'description', label: 'Description'},
    {key: 'createdAt', label: 'Created At'},
    {key: 'updatedAt', label: 'Updated At'},
    {key: 'contentPermissions', label: 'Content Permissions'}
  ]
};
