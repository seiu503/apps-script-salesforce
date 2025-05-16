/**
 * Generates a JSON Web Token (JWT) for Salesforce server-to-server integration.
 *
 * @return {string} the JWT
 */
const createJwtProd_ = () => {
  const privateKey = DriveApp.getFileById(PRIVATE_KEY_FILE_ID_PROD)
    .getBlob()
    .getDataAsString();
  // console.log('privateKey');
  // console.log(privateKey);
  const accessToken = createJwt({
    privateKey,
    expiresInMinutes: 2,
    data: {
      iss: CONSUMER_KEY_PROD,
      aud: PROD_URL,
      sub: USERNAME_PROD,
    },
  });
  // console.log('accessToken');
  // console.log(accessToken);
  return accessToken;
};

/**
 * Requests an access token from Salesforce using a JWT for authentication.
 *
 * @return {object} the response object which includes the access_token and instance_url
 */
const requestAccessTokenProd_ = () => {
  // console.log('OAuthProd: 28: jwt');
  const jwt = createJwtProd_();
  // console.log(jwt);
  const endpoint =
    TOKEN_URL_PROD +
    "?grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer" +
    "&assertion=" +
    jwt;

  // console.log('OAuthProd: 41: endpoint');
  // console.log(endpoint);
  const options = {
    method: 'POST',
    contentType: "application/x-www-form-urlencoded"
  };
  // console.log('options');
  // console.log(options);
  const resp = UrlFetchApp.fetch(endpoint, options);
  // console.log('resp');
  // console.log(resp);
  return JSON.parse(resp.getContentText());
};
