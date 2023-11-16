const SEARCHPARAMS = {
    searchText: '',
    fq: [],
    fl: '*',
    mm: '100%',
    df: 'patentTitle',
    qf: 'appEarlyPubNumber applId appStatus_txt appConfrNumber appEntityStatus_txt',
    facet: 'false',
    sort: 'applId asc',
    start: '0',
};

module.exports = { SEARCHPARAMS }
