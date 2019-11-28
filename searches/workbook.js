const hydrators = require('../hydrators');

const searchWorkbook = (z, bundle) => {
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

module.exports = {
  key: 'workbook',
  noun: 'Workbook',

  display: {
    label: 'Get a Workbook',
    description: 'Returns a workbook based on its ID.'
  },

  operation: {
    inputFields: [
      {key: 'luid', required: true, helpText: 'Get a specific workbook.', dynamic: 'workbookList.id.name'}
    ],
    perform: searchWorkbook,

		sample: {
	      project: {
	          id: "224a64ce-fad5-11e3-83c4-a32ad25bb5ca",
	          name: "Default"
	      },
	      owner: {
	          id: "721e18b7-9780-466e-and3-fec87932a274",
	          name: "craig"
	      },
	      tags: {
	          tag: [
	              {
	                  label: "Test"
	              }
	          ]
	      },
	      views: {
	          view: [
	              {
	                  tags: {},
	                  id: "dd733ee0-ebbb-4d83-a669-f94b13101fe3",
	                  name: "Overview ",
	                  contentUrl: "SuperstoreWebhooksDemo/sheets/Overview",
	                  createdAt: "2019-09-30T08:54:40Z",
	                  updatedAt: "2019-09-30T08:54:40Z",
	                  viewUrlName: "Overview"
	              },
	              {
	                  tags: {},
	                  id: "050a9657-27e8-4794-bc37-f95bb651760c",
	                  name: "Product",
	                  contentUrl: "SuperstoreWebhooksDemo/sheets/Product",
	                  createdAt: "2019-09-30T08:54:41Z",
	                  updatedAt: "2019-09-30T08:54:41Z",
	                  viewUrlName: "Product"
	              }
	          ]
	      },
	      id: "1e6c7726-35f8-44d4-9bef-edc24a96c9c4",
	      name: "Superstore Webhooks Demo",
	      description: "",
	      contentUrl: "SuperstoreWebhooksDemo",
	      webpageUrl: "https://server.tableau.com/#/site/demo/workbooks/7107",
	      showTabs: "false",
	      size: "1",
	      createdAt: "2019-09-30T08:54:40Z",
	      updatedAt: "2019-09-30T08:54:41Z",
	      encryptExtracts: "false",
	      defaultViewId: "dd733ee0-ebbb-4d83-a669-f94b13101fe3",
				file: 'Workbook.twbx',
				previewImage: 'Preview Image.png',
				defaultViewImage: 'Default View Image.png'
		},

	  outputFields: [
	    {key: 'project__id', label: 'Project ID'},
	    {key: 'project__name', label: 'Project Name'},
	    {key: 'owner__id', label: 'Owner ID'},
	    {key: 'owner__name', label: 'Owner Name'},
	    {key: 'tags__tag[]label', label: 'Workbook Tag'},
			{key: 'views__view[]tags__tag[]label', label: 'View Tag'},
	    {key: 'views__view[]id', label: 'View ID'},
	    {key: 'views__view[]name', label: 'View Name'},
	    {key: 'views__view[]contentUrl', label: 'View Content Url'},
	    {key: 'views__view[]createdAt', label: 'View Created At'},
	    {key: 'views__view[]updatedAt', label: 'View Updated At'},
	    {key: 'views__view[]viewUrlName', label: 'View Url Name'},
	    {key: 'id', label: 'Workbook ID'},
	    {key: 'name', label: 'Workbook Name'},
	    {key: 'description', label: 'Workbook Description'},
	    {key: 'contentUrl', label: 'Workbook Content Url'},
	    {key: 'webpageUrl', label: 'Workbook Wep Page Url'},
	    {key: 'showTabs', label: 'Workbook Show Tabs'},
	    {key: 'size', label: 'Workbook Size'},
	    {key: 'createdAt', label: 'Workbook Created At'},
	    {key: 'updatedAt', label: 'Workbook Updated At'},
	    {key: 'encryptExtracts', label: 'Workbook Encrypted Extracts'},
			{key: 'file', type: 'file', label: 'twbx' },
			{key: 'previewImage', type: 'file', label: 'Preview Image' },
			{key: 'defaultViewImage', type: 'file', label: 'Default View Image' }
	  ]
  }
};
