const axios = require('axios');
const queryString = require('query-string');

const API_URL =
  process.env.NODE_ENV === 'production'
    ? `https://hutech-votes-backend.herokuapp.com`
    : `http://localhost:3001`;

async function makeRequest(url, method, data, headers) {
  try {
    const options = {
      url,
      method,
      headers,
      timeout: 30000,
      data: ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())
        ? data
        : undefined
    };

    const response = await axios(options);

    return response.data;
  } catch (error) {
    let err = error;
    err.code = 500;

    if (error.response) {
      const errorMessage =
        err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Internal Server Error';

      err = Error(errorMessage);
      err.data = error.response.data;
      err.code = error.response.status;
    }

    throw err;
  }
}

export async function paginateCandidates(query) {
  const url = `${API_URL}/api/candidates?${queryString.stringify(query)}`;

  return makeRequest(url, 'GET');
}

export async function paginateCategories(query) {
  const url = `${API_URL}/api/categories?${queryString.stringify(query)}`;

  return makeRequest(url, 'GET');
}

export async function getCandidateById(id) {
  const url = `${API_URL}/api/candidates/${id}`;

  return makeRequest(url, 'GET');
}

export async function vote(id) {
  const url = `${API_URL}/api/candidates/${id}/vote`;

  return makeRequest(url, 'GET');
}

export async function findVoteHistory(query) {
  const url = `${API_URL}/api/vote-history?${queryString.stringify(query)}`;

  return makeRequest(url, 'GET');
}

export async function getVoteHistoryByCandidateId(id) {
  const url = `${API_URL}/api/vote-history/${id}`;

  return makeRequest(url, 'GET');
}
