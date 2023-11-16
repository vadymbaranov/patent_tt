require('dotenv').config();
const path = require('node:path');
const readline = require('node:readline');
const {
    createApplicationStructure,
    createJSONFile,
    downloadFile,
} = require('./src/services/fileService');
const {
    searchForApplication,
    getApplicationDocumentsList,
} = require('./src/services/requestService');
const { SEARCHPARAMS } = require('./src/constants/requestConstants');
const { BASEDIR, FILEPATH } = require('./src/constants/folderConstants');

const applicationID = process.env.APPLICATION_ID;

const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function main(applicationNumber) {
    const applicationJSONPath = path.join(BASEDIR, 'application.json');
    const filesJSONPath = path.join(BASEDIR, 'files.json');

    SEARCHPARAMS.searchText = applicationNumber;

    try {
        const searchResults = await searchForApplication(SEARCHPARAMS);

        if (
            !searchResults?.queryResults?.searchResponse?.response
                ?.numFoundExact
        ) {
            console.log('Application not found!');
            return;
        }

        await createApplicationStructure();

        await createJSONFile(
            applicationJSONPath,
            searchResults?.queryResults?.searchResponse?.response?.docs
        );

        const applicationDocList = await getApplicationDocumentsList(
            applicationNumber
        );

        const fileInfo = [];

        await Promise.all(
            applicationDocList.map(async (doc) => {
                const documentSize = await downloadFile(
                    doc?.pdfUrl,
                    `${FILEPATH}/${doc?.documentIdentifier}.pdf`
                );

                return fileInfo.push({
                    name: doc?.documentIdentifier,
                    size: documentSize.toFixed(2),
                    description: doc?.documentDescription,
                    docCode: doc?.documentCode,
                    pageQuantity: doc?.pageCount,
                });
            })
        );

        await createJSONFile(filesJSONPath, fileInfo);

        return;
    } catch (err) {
        console.error(err);
    }
}

function askQuestion() {
    terminal.question(
        'Hi! Please enter your application number (only digits no special characters like (/ , etc.): ',
        async (data) => {
            terminal.pause();
            console.log('Processing your request. Please wait...');
            // checking if data is not null or undefined
            if (data != null) {
                const applicationID = data.trim();

                try {
                    await main(applicationID);

                    console.log('Success!');
                    return;
                } catch (err) {
                    console.error('Something went wrong: ', err);
                }
            }
        }
    );
}

askQuestion();
