const fsPromises = require('node:fs').promises;
const fs = require('node:fs');
const path = require('node:path');
const PdfParser = require('pdf-parse');
const { BASEDIR, FOLDERS } = require('../constants/folderConstants');
const { getDocument } = require('./requestService');

// checking if a directory exists and creating one if it doesn't
async function createDirectory(dir) {
    const resolvedDir = path.resolve(dir);
    try {
        await fsPromises.access(resolvedDir);
        console.log(`Directory ${resolvedDir} exists`);
    } catch (err) {
        console.error(err);
        console.log(`Directory ${resolvedDir} not found. Creating one now...`);
        try {
            await fsPromises.mkdir(resolvedDir, { recursive: true });
            console.log(
                `Directory ${resolvedDir} has been successfully created`
            );
        } catch (err) {
            console.error(`Error while creating directory ${resolvedDir}`, err);
        }
    }
}

// creating necessary folder structure
async function createApplicationStructure() {
    try {
        for (const folder of FOLDERS) {
            await createDirectory(path.join(BASEDIR, folder));
        }

        console.log(
            'Application folders structure has been created or it already exists.'
        );
    } catch (err) {
        console.error(err);
    }
}

// adding application.json file to the root of application folder
async function createJSONFile(dir, content) {
    const resolvedDir = path.resolve(dir);

    try {
        await fsPromises.writeFile(
            resolvedDir,
            JSON.stringify(content, null, 2),
            'utf8'
        );
        console.log(`File ${resolvedDir} has been successfully created`);
    } catch (err) {
        console.error(`Error while creating file ${resolvedDir}`, err);
    }
}

async function downloadFile(documentUrl, destinationPath) {
    try {
        const response = await getDocument(documentUrl);

        const writer = fs.createWriteStream(destinationPath);

        let fileSizeInBytes = 0;

        response.on('data', (chunk) => {
            fileSizeInBytes += chunk.length;
        });

        response.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                const fileSizeInKilobytes = fileSizeInBytes / 1024;
                resolve(fileSizeInKilobytes);
            });
            writer.on('error', reject);
        });
    } catch (err) {
        console.error('Error downloading file:', err);
    }
}

module.exports = { createApplicationStructure, createJSONFile, downloadFile };
