const https = require('https');

const testEmployeeLoginWithHeader = async () => {
  const data = JSON.stringify({
    accessCode: 'COMP2025-8A0633'
  });

  const options = {
    hostname: '8465c230-7f79-4824-855a-9cabe89a7383-00-3aklzfh6u39se.spock.replit.dev',
    port: 443,
    path: '/api/employee/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'Accept': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log(`Login Status Code: ${res.statusCode}`);
      
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        console.log('Login Response:', body);
        
        if (res.statusCode === 200) {
          const loginData = JSON.parse(body);
          const sessionHeader = JSON.stringify({
            companyId: loginData.companyId,
            continuationCode: loginData.continuationCode,
            sessionId: loginData.sessionId
          });
          
          console.log('\nTesting survey GET with session header...');
          
          // Now test getting survey with session header
          const surveyOptions = {
            hostname: '8465c230-7f79-4824-855a-9cabe89a7383-00-3aklzfh6u39se.spock.replit.dev',
            port: 443,
            path: '/api/employee/survey',
            method: 'GET',
            headers: {
              'X-Employee-Session': sessionHeader,
              'Accept': 'application/json'
            }
          };
          
          https.get(surveyOptions, (surveyRes) => {
            console.log(`Survey GET Status: ${surveyRes.statusCode}`);
            let surveyBody = '';
            surveyRes.on('data', (chunk) => surveyBody += chunk);
            surveyRes.on('end', () => {
              console.log('Survey Response:', surveyBody);
              resolve();
            });
          });
        } else {
          reject(new Error(`Login failed with status ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

// Run the test
console.log('Testing employee login with session header workaround...\n');
testEmployeeLoginWithHeader()
  .then(() => {
    console.log('\nTest completed successfully!');
  })
  .catch(error => {
    console.error('\nTest failed:', error.message);
  });