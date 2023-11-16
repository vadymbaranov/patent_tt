const axios = require('axios');

const requestInstance = axios.create({
    baseURL: 'https://ped.uspto.gov/api/queries',
    headers: 'Content-Type:application/json',
});

function get(url, config) {
    return requestInstance
        .get(url, config)
        .then((res) => res.data)
        .catch((err) => console.error(err));
}

function post(url, data, config) {
    return requestInstance
        .post(url, data, config)
        .then((res) => res.data)
        .catch((err) => console.error(err));
}

const searchForApplication = async (data) => {
    return post('', data);
};

const getApplicationDocumentsList = async (applicationID) => {
    return get(`/cms/public/${applicationID}`);
};

const getDocument = async (documentUrl) => {
    return get(`/cms/${documentUrl}`, {
        headers: { 'Content-Type': 'application/pdf' },
        responseType: 'stream',
    });
};

module.exports = {
    searchForApplication,
    getApplicationDocumentsList,
    getDocument,
};
