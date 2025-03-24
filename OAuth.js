/**
 * Generates a JSON Web Token (JWT) for Salesforce server-to-server integration.
 *
 * @return {string} the JWT
 */
const createJwt_ = () => {
  const privateKey = DriveApp.getFileById(PRIVATE_KEY_FILE_ID)
    .getBlob()
    .getDataAsString();
  const accessToken = createJwt({
    privateKey,
    expiresInMinutes: 2,
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
  const jwt = createJwt_();
  const endpoint =
    TOKEN_URL +
    "?grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer" +
    "&assertion=" +
    jwt;

  const options = {
    method: 'POST',
    contentType: "application/x-www-form-urlencoded"
  };

  const resp = UrlFetchApp.fetch(endpoint, options);
  return JSON.parse(resp.getContentText());
};
