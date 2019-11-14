require('should');

const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('Check authentication & create user', () => {
  var creds = {};
  var userId = '';
  it('passes authentication and returns creds', (done) => {
    const bundle =
      {
        authData: {
          serverUrl: 'https://tableauserver.theinformationlab.co.uk',
          apiVersion: "3.6",
					authType: 'token',
          personalAccessTokenName: "ZapierDev",
          personalAccessTokenSecret: "Ar6remGiSmuBsbRR3vcxSg==:iF66YNfU02Iky2UCV4djwgoA1nQeWDWo"
        }
      };
    appTester(App.authentication.sessionConfig.perform, bundle)
      .then((results) => {
        results.should.have.property('creds')
        creds = results.creds;
        done();
      })
      .catch(done);
  });

	// 1e6c7726-35f8-44d4-9bef-edc24a96c9c4

	// it('searched for a workbook and returns user meta', (done) => {
  //   const bundle =
  //     {
  //       authData: {
  //         serverUrl: 'https://beta.theinformationlab.co.uk',
  //         apiVersion: "3.6",
  //         creds : creds
  //       },
  //       inputData : {
  //         luid : '5a74009f-d8c1-4343-bee8-02f17465c500'
  //       }
  //     };
  //   appTester(App.searches.workbook.operation.perform, bundle)
  //     .then((results) => {
	// 			z.console.log(results);
	// 			const result = results[0];
  //       result.should.have.property('id')
	// 			result.should.have.property('name')
	// 			z.console.log(results[0].previewImage);
  //       done();
  //     })
  //     .catch(done);
  // });

  // it('creates user and returns user meta', (done) => {
  //   const bundle =
  //     {
  //       authData: {
  //         serverUrl: 'https://beta.theinformationlab.co.uk',
  //         apiVersion: "3.6",
  //         creds : creds
  //       },
  //       inputData : {
  //         username : 'zapierTest',
  //         siteRole : 'Viewer'
  //       }
  //     };
  //   appTester(App.creates.newUser.operation.perform, bundle)
  //     .then((results) => {
  //       results.should.have.property('id')
  //       userId = results.id;
  //       done();
  //     })
  //     .catch(done);
  // });
	//
  // it('updates full name and password', (done) => {
  //   const bundle =
  //     {
  //       authData: {
  //         serverUrl: 'https://beta.theinformationlab.co.uk',
  //         apiVersion: "3.6",
  //         creds : creds
  //       },
  //       inputData : {
  //         userId : userId,
  //         password : 'zapPass',
  //         fullName : "Zapier Test User"
  //       }
  //     };
  //   appTester(App.creates.updateUser.operation.perform, bundle)
  //     .then((results) => {
  //       results.should.have.property('name')
  //       done();
  //     })
  //     .catch(done);
  // });
  // it('returns a list of users', (done) => {
  //   const bundle =
  //     {
  //       authData: {
  //         serverUrl: 'https://tableauserver.theinformationlab.co.uk',
  //         apiVersion: "3.2",
  //         creds : creds
  //       }
  //     };
  //   appTester(App.searches.users.operation.perform, bundle)
  //     .then((results) => {
  //       results[0].should.have.property('id')
  //       done();
  //     })
  //     .catch(done);
  // });
});
