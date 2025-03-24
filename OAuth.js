/**
 * Generates a JSON Web Token (JWT) for Salesforce server-to-server integration.
 *
 * @return {string} the JWT
 */
const createJwt_ = () => {
  // Your super secret private key
  const privateKey = DriveApp.getFileById(PRIVATE_KEY_FILE_ID)
    .getBlob()
    .getDataAsString();
  const accessToken = createJwt({
    privateKey,
    expiresInMinutes: 2, // expires in 2 minutes, must be within 3 minutes
    // iss = issuer's client_id, aud = audience identifies the authroization server
    data: {
      iss: CONSUMER_KEY,
      // aud: "https://login.salesforce.com",
      aud: SANDBOX_URL,
      sub: USERNAME,
    },
  });
  return accessToken;
};

/**
 * Requests an access token from Salesforce using a JWT for authentication.
 *
 * @return {object} the response object which includes the access_token and instance_url
 */
const requestAccessToken_ = () => {
  console.log('OAuth.gs > 31 requestAccessToken');
  const jwt = createJwt_();
  console.log('OAuth.gs > 33 jwt');
  console.log(jwt);
  const endpoint =
    TOKEN_URL +
    "?grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer" +
    // "?grant_type=authorization_code" +
    "&assertion=" +
    jwt;
  console.log('OAuth.gs > 40 endpoint');
  console.log(endpoint);

  const options = {
    method: 'POST',
    // headers: {
      contentType: "application/x-www-form-urlencoded"
      // }
  };

  const resp = UrlFetchApp.fetch(endpoint, options);

  console.log('OAuth.gs > 53 resp.getContentText()');
  console.log(resp.getContentText());
  return JSON.parse(resp.getContentText());
};
