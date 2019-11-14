const hydrators = require('../hydrators');
// triggers on workbook with a certain tag
const triggerWorkbook = (z, bundle) => {
  return z.request({
      url: `${bundle.authData.serverUrl}/api/${bundle.authData.apiVersion}/sites/${bundle.authData.creds.site.id}/workbooks`,
      params : {
        pageSize : 100,
        sort : 'updatedAt:desc'
      }
    })
    .then((response) => {
      const workbooks = z.JSON.parse(response.content).workbooks.workbook;
      return workbooks.map((workbook) => {
        workbook.file = z.dehydrateFile(hydrators.downloadFile, {
          workbookId: workbook.id,
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
    label: 'Get Workbook',
    description: 'Triggers on a new workbook.'
  },

  operation: {
    inputFields: [

    ],
    perform: triggerWorkbook,
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
        updatedAt: "2015-04-07T07:31:01Z"
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
      {key: 'updatedAt', label: 'Updated At'}
    ]
  }
};
