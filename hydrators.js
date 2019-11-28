const hydrators = {
  downloadWorkbook: (z, bundle) => {
    // use standard auth to request the file
    const filePromise = z.request({
      url: `${bundle.authData.serverUrl}/api/${bundle.authData.apiVersion}/sites/${bundle.authData.creds.site.id}/workbooks/${bundle.inputData.workbookId}/content?includeExtract=true`,
      method: 'GET',
      raw: true,
      headers: {
        'X-Tableau-Auth' : bundle.authData.creds.token
      }
    });
    // and swap it for a stashed URL
    return z.stashFile(filePromise, null, `${bundle.inputData.filename}.twbx`)
      .then((url) => {
        z.console.log(`Stashed URL = ${url}`);
        return url;
      });
  },
	downloadWorkbookPreviewImage: (z, bundle) => {
    // use standard auth to request the file
    const filePromise = z.request({
      url: `${bundle.authData.serverUrl}/api/${bundle.authData.apiVersion}/sites/${bundle.authData.creds.site.id}/workbooks/${bundle.inputData.workbookId}/previewImage`,
      method: 'GET',
      raw: true,
      headers: {
        'X-Tableau-Auth' : bundle.authData.creds.token
      }
    });
    // and swap it for a stashed URL
    return z.stashFile(filePromise, null, `${bundle.inputData.filename}.png`)
      .then((url) => {
        z.console.log(`Workbook Preview Image Stashed URL = ${url}`);
        return url;
      });
  },
	downloadViewImage: (z, bundle) => {
    // use standard auth to request the file
    const filePromise = z.request({
      url: `${bundle.authData.serverUrl}/api/${bundle.authData.apiVersion}/sites/${bundle.authData.creds.site.id}/views/${bundle.inputData.viewId}/image?resolution=${bundle.inputData.resolution}&maxAge=1`,
      method: 'GET',
      raw: true,
      headers: {
        'X-Tableau-Auth' : bundle.authData.creds.token
      }
    });
    // and swap it for a stashed URL
    return z.stashFile(filePromise, null, `${bundle.inputData.filename}.png`)
      .then((url) => {
        z.console.log(`View Image Stashed URL = ${url}`);
        return url;
      });
  }
};

module.exports = hydrators;
