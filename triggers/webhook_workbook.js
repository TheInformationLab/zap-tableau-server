const hydrators = require('../hydrators');

const subscribeHook = (z, bundle) => {
  // bundle.targetUrl has the Hook URL this app should call when a recipe is created.
	const webhookSource = {};
	webhookSource[bundle.inputData.webhookSource] = {};
  const data = {
	   webhook: {
	      "webhook-source": webhookSource,
	      "webhook-destination": {
	         "webhook-destination-http": {
	            method: "POST",
	            url: bundle.targetUrl
	         }
	      },
	      name: bundle.inputData.webhookName
	   }
	};

  // You can build requests and our client will helpfully inject all the variables
  // you need to complete. You can also register middleware to control this.
  const options = {
    url: `${bundle.authData.serverUrl}/api/${bundle.authData.apiVersion}/sites/${bundle.authData.creds.site.id}/webhooks`,
    method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
    body: data
  };

  // You may return a promise or a normal data structure from any perform method.
  return z.request(options).then(response => JSON.parse(response.content));
};

const unsubscribeHook = (z, bundle) => {
  // bundle.subscribeData contains the parsed response JSON from the subscribe
  // request made initially.
  const hookId = bundle.subscribeData.webhook.id;

  // You can build requests and our client will helpfully inject all the variables
  // you need to complete. You can also register middleware to control this.
  const options = {
    url: `${bundle.authData.serverUrl}/api/${bundle.authData.apiVersion}/sites/${bundle.authData.creds.site.id}/webhooks/${hookId}`,
    method: 'DELETE'
  };

  // You may return a promise or a normal data structure from any perform method.
  return z.request(options).then(response => JSON.parse(response.content));
};

const getWorkbook = (z, bundle) => {
  // bundle.cleanedRequest will include the parsed JSON object (if it's not a
  // test poll) and also a .querystring property with the URL's query string.
	z.console.log('[webhook_workbook] getWorkbook cleanedRequest', bundle.cleanedRequest);

  const payload = {
    resource: bundle.cleanedRequest.resource,
    eventType: bundle.cleanedRequest['event_type'],
    resourceName: bundle.cleanedRequest['resource_name'],
    siteId: bundle.cleanedRequest['site_luid'],
    resourceId: bundle.cleanedRequest['resource_luid'],
    createdAt: bundle.cleanedRequest['created_at']
  };

	return z.request({
      url: `${bundle.authData.serverUrl}/api/${bundle.authData.apiVersion}/sites/${bundle.authData.creds.site.id}/workbooks/${payload.resourceId}`
    })
    .then((response) => {
      const workbook = z.JSON.parse(response.content).workbook;
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
      return [workbook];
    });
};

const getFallbackRealWorkbook = (z, bundle) => {
  // For the test poll, you should get some real data, to aid the setup process.
	return z.request({
      url: `${bundle.authData.serverUrl}/api/${bundle.authData.apiVersion}/sites/${bundle.authData.creds.site.id}/workbooks`
    })
    .then((response) => {
      const workbooks = z.JSON.parse(response.content).workbooks.workbook;
      return workbooks.map((workbook) => {
        workbook.file = z.dehydrateFile(hydrators.downloadWorkbook, {
          workbookId: workbook.id,
          filename: workbook.contentUrl
        });
				workbook.previewImage = z.dehydrateFile(hydrators.downloadWorkbookPreviewImage, {
          workbookId: workbook.defaultViewId,
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

// We recommend writing your triggers separate like this and rolling them
// into the App definition at the end.
module.exports = {
  key: 'workbookWebhook',

  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'Workbook',
  display: {
    label: 'Workbook Event (Webhook requires Tableau 2019.4 or above)',
    description: 'Trigger on workbook events created, updated and deleted',
		important: true
  },

  // `operation` is where the business logic goes.
  operation: {
    // `inputFields` can define the fields a user could provide,
    // we'll pass them in as `bundle.inputData` later.
    inputFields: [
      {
        key: 'webhookName',
				label: 'Webhook Name',
        type: 'string',
        helpText: 'Give your webhook a name for future refrence.'
      },
			{
        key: 'webhookSource',
				label: 'Trigger Event',
        helpText: 'Select the workbook event which will trigger this zap.',
				choices: { 'webhook-source-event-workbook-created': 'Workbook Created', 'webhook-source-event-workbook-updated': 'Workbook Updated', 'webhook-source-event-workbook-deleted' : 'Workbook Deleted'}
      }
    ],

    type: 'hook',

    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,

    perform: getWorkbook,
    performList: getFallbackRealWorkbook,

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
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
  }
};
