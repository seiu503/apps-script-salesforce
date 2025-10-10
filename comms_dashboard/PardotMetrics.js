const accessToken = '00D61000000YqfV!AQEAQIxflm_xPalpapiv5pQQZSB93oKyB_V29G95Dc8J9RRyX94NZokf_lgEgLjnGh_rXg1.l0UU3nM5FDpU9it29dfzF8aF'; // Replace with your actual access token
const businessUnitId = "0Uv61000000PAwjCAG";
const listId = 204582;

async function getPardotMetrics() {

  const url = `https://pi.pardot.com/api/listMembership/version/4/do/query?list_id=${listId}&format=json&limit=1`;

  try {

  const response = await UrlFetchApp.fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Pardot-Business-Unit-Id': businessUnitId,
      'Content-Type': 'application/json',
      'muteHttpExceptions': false
    }
  });
  console.log(response.getContentText());
  console.log(`Number of prospects in list ${listId}: ${response.getContent().length}`); 

   } catch(error) {
      console.error('API call failed:');
      console.log(error);
    };
}

let totalCount = 0;
let nextPageToken = null;
let page = 1;

async function countListMembers() {
  try {
    while (true) {
      let url = `https://pi.pardot.com/api/v5/objects/list-memberships?listId=${listId}&fields=prospectId&limit=200`;
      if (nextPageToken) {
        url += `&nextPageToken=${nextPageToken}`;
      }

      const response = UrlFetchApp.fetch(url, {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Pardot-Business-Unit-Id': businessUnitId,
          'Content-Type': 'application/json'
        },
        muteHttpExceptions: true
      });

      const data = JSON.parse(response.getContentText());

      const batchSize = data.values?.length || 0;
      totalCount += batchSize;

      Logger.log(`Page ${page}: Fetched ${batchSize}, Total so far: ${totalCount}`);
      page++;

      if (!data.nextPageToken || batchSize === 0) {
        break;
      }

      nextPageToken = data.nextPageToken;
      Logger.log(`Next page token: ${nextPageToken}`);
    }

    Logger.log(`✅ Total prospects in list ${listId}: ${totalCount}`);
  } catch (error) {
    Logger.log(`❌ API call failed: ${error}`);
  }
}

const BASE = 'https://pi.pardot.com/api/v5/objects';
const headers = {
  Authorization: `Bearer ${accessToken}`,
  'Pardot-Business-Unit-Id': businessUnitId
};

function totalListEmailsCY() {
  const start = '2025-01-01T00:00:00Z'; // this calendar year
  const qUrl = `${BASE}/list-emails?sentAtAfterOrEqualTo=${encodeURIComponent(start)}&fields=id,sentAt`;
  const ids = fetchAll(qUrl, headers).map(r => r.id);

  let totalSent = 0;
  ids.forEach(id => {
    const stats = fetchJson(`${BASE}/list-emails/${id}/stats`, headers);
    // Depending on your definition use stats.sent or stats.delivered
    totalSent += Number(stats.sent || 0);
  });
  console.log(`totalSent: ${totalSent}`);
  return totalSent;
}

function fetchJson(url, headers) {
  const res = UrlFetchApp.fetch(url, {headers});
  return JSON.parse(res.getContentText());
}

function fetchAll(url, headers) {
  // add pagination handling if your BU sends a lot; omitted for brevity
  return fetchJson(url, headers).results || [];
}

