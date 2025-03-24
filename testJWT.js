const createJwtTEST = (credentials) => {
  try {
    // JWT Header
    const header = {
      alg: 'RS256',
      typ: 'JWT',
    };

    const {
      iss,
      sub,
      aud,
      key,
    } = credentials;

    // Determine expired time
    const expireTime = new Date();
    expireTime.setSeconds(expireTime.getSeconds() + 180);

    // Create JWT payload
    const payload = {
      iss,
      sub,
      aud,
      exp: expireTime.valueOf(),
    };

    // Encode payload and header
    const encodedHeader = Utilities.base64EncodeWebSafe(JSON.stringify(header)).replace(/=+$/, '');
    const encodedPayload = Utilities.base64EncodeWebSafe(JSON.stringify(payload)).replace(/=+$/, '');
    const data = `${encodedHeader}.${encodedPayload}`;

    // Make signature
    const signatureBytesTest = Utilities.computeRsaSha256Signature(data, PRIVATE_KEY);
    const signature = Utilities.base64EncodeWebSafe(signatureBytesTest).replace(/=+$/, '');

    return `${data}.${signature}`;
  } catch (error) {
    logErrorFunctions('createJwt', credentials, '', error);
    return '';
  }
};