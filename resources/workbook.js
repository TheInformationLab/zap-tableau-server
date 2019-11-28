const hydrators = require('../hydrators');

// get a single workbook
const getWorkbook = (z, bundle) => {
	return z.request({
      url: `${bundle.authData.serverUrl}/api/${bundle.authData.apiVersion}/sites/${bundle.authData.creds.site.id}/workbooks/${bundle.inputData.luid}`
    })
		.then((response) => {
			const workbooks = [z.JSON.parse(response.content).workbook];
      return workbooks.map((workbook) => {
        workbook.file = z.dehydrateFile(hydrators.downloadWorkbook, {
          workbookId: workbook.id,
          filename: workbook.contentUrl
        });
				workbook.previewImage = z.dehydrateFile(hydrators.downloadWorkbookPreviewImage, {
          workbookId: workbook.id,
          filename: workbook.contentUrl
        });
				workbook.defaultViewImage = z.dehydrateFile(hydrators.downloadViewImage, {
	        viewId: workbook.id,
					resolution: 'high',
	        filename: workbook.contentUrl
	      });
        return workbook;
      });
    });
};

// get a list of workbooks
const listWorkbooks = (z, bundle) => {
	return z.request({
      url: `${bundle.authData.serverUrl}/api/${bundle.authData.apiVersion}/sites/${bundle.authData.creds.site.id}/workbooks`,
      params : {
        pageSize : 100,
				pageNumber : bundle.meta.page + 1,
        sort : 'updatedAt:desc'
      }
    })
    .then((response) => {
			const workbooks = z.JSON.parse(response.content).workbooks.workbook;
      return workbooks.map((workbook) => {
        workbook.file = z.dehydrateFile(hydrators.downloadWorkbook, {
          workbookId: workbook.id,
          filename: workbook.contentUrl
        });
				workbook.previewImage = z.dehydrateFile(hydrators.downloadWorkbookPreviewImage, {
          workbookId: workbook.id,
          filename: workbook.contentUrl
        });
				workbook.defaultViewImage = z.dehydrateFile(hydrators.downloadViewImage, {
	        viewId: workbook.id,
					resolution: 'high',
	        filename: workbook.contentUrl
	      });
        return workbook;
      });
    });
};

// find a particular workbook by name
// const searchWorkbooks = (z, bundle) => {
//   const responsePromise = z.request({
//     url: 'https://jsonplaceholder.typicode.com/posts',
//     params: {
//       query: `name:${bundle.inputData.name}`
//     }
//   });
//   return responsePromise
//     .then(response => z.JSON.parse(response.content));
// };
//
// // create a workbook
// const createWorkbook = (z, bundle) => {
//   const responsePromise = z.request({
//     method: 'POST',
//     url: 'https://jsonplaceholder.typicode.com/posts',
//     body: {
//       name: bundle.inputData.name // json by default
//     }
//   });
//   return responsePromise
//     .then(response => z.JSON.parse(response.content));
// };

module.exports = {
  key: 'workbook',
  noun: 'Workbook',

  get: {
    display: {
      label: 'Get Workbook',
      description: 'Gets a workbook.'
    },
    operation: {
      inputFields: [
        {key: 'luid', label:'Workbook ID', required: true, helpText: 'Get a specific workbook.', dynamic: 'workbookList.id.name'}
      ],
      perform: getWorkbook
    }
  },

  list: {
    display: {
      label: 'New Workbook (Resource)',
      description: 'Triggers when a new workbook is created.'
    },
    operation: {
      perform: listWorkbooks,
			canPaginate: true
    }
  },

  // search: {
  //   display: {
  //     label: 'Find Workbook',
  //     description: 'Finds a workbook by searching.'
  //   },
  //   operation: {
  //     inputFields: [
  //       {key: 'name', required: true}
  //     ],
  //     perform: searchWorkbooks
  //   },
  // },
	//
  // create: {
  //   display: {
  //     label: 'Create Workbook',
  //     description: 'Creates a new workbook.'
  //   },
  //   operation: {
  //     inputFields: [
  //       {key: 'name', required: true}
  //     ],
  //     perform: createWorkbook
  //   },
  // },
	//
	sample: {
			project: {
				id: "123bc49a-fad5-11e3-a880-ebaa1b92e774",
				name: "Project Name"
			},
			owner: {
				id: "321e18b7-9780-466e-adc7-fec79802a274"
			},
			tags: {
				tag: [
					{
						"label": "Tag"
					}
				]
			},
			id: "22338e1e-fad5-11e3-a9ad-87d868e0f6bb",
			name: "Demo Workbook",
			contentUrl: "DemoWorkbook",
			webpageUrl: "https://tableauserver.theinformationlab.co.uk/#/site/demo/workbooks/123",
			showTabs: "false",
			size: "1",
			createdAt: "2012-06-14T09:26:44Z",
			updatedAt: "2015-04-07T07:31:01Z",
			encryptExtracts: "false",
			defaultViewId: "226ebbe4-fad5-11e3-abcd-1791fd801573",
			file: 'Workbook.twbx',
			previewImage: 'Preview Image.png',
			defaultViewImage: 'Default View Image.png'
		},

	outputFields: [
		{key: 'project__id', label: 'Project ID'},
		{key: 'project__name', label: 'Project Name'},
		{key: 'owner__id', label: 'Owner ID'},
		{key: 'tags__tag[]label', label: 'Tag'},
		{key: 'id', label: 'ID'},
		{key: 'name', label: 'Name'},
		{key: 'contentUrl', label: 'Content URL'},
		{key: 'webpageUrl', label: 'Webpage URL'},
		{key: 'showTabs', label: 'Show Tabs?', type: 'boolean'},
		{key: 'size', label: 'Size'},
		{key: 'createdAt', label: 'Created At'},
		{key: 'updatedAt', label: 'Updated At'},
		{key: 'encryptExtracts', label: 'Encrypted Extracts'},
		{key: 'defaultViewId', label: 'Default View ID'},
		{key: 'file', type: 'file', label: 'twbx' },
		{key: 'previewImage', type: 'file', label: 'Preview Image' },
		{key: 'defaultViewImage', type: 'file', label: 'Default View Image' }
	]
};
