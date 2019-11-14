// find a particular workbookpreviewimage by name
const searchWorkbookpreviewimage = (z, bundle) => {
  const responsePromise = z.request({
    url: 'https://jsonplaceholder.typicode.com/posts',
    params: {
      name: bundle.inputData.name
    }
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content));
};

module.exports = {
  key: 'workbook_preview_image',
  noun: 'Workbookpreviewimage',

  display: {
    label: 'Find a Workbookpreviewimage',
    description: 'Finds a workbookpreviewimage.'
  },

  operation: {
    inputFields: [
      {key: 'name', required: true, helpText: 'Find the Workbookpreviewimage with this name.'}
    ],
    perform: searchWorkbookpreviewimage,

    sample: {
      id: 1,
      name: 'Test'
    },

    outputFields: [
      {key: 'id', label: 'ID'},
      {key: 'name', label: 'Name'}
    ]
  }
};
