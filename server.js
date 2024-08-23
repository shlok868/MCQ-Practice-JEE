const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const dataFolder = path.join(__dirname, 'public', 'data');

app.use(express.static('public'));

// Function to create routes for each folder
const createRoutesForFolders = (baseFolder) => {
    fs.readdir(baseFolder, { withFileTypes: true }, (err, items) => {
        if (err) {
            return console.error('Unable to scan directory: ' + err);
        }

        const folders = [];

        items.forEach(item => {
            if (item.isDirectory()) {
                const folderPath = path.join(baseFolder, item.name);
                const routePath = `/${item.name}.json`;

                folders.push(item.name);

                app.get(routePath, (req, res) => {
                    fs.readdir(folderPath, (err, files) => {
                        if (err) {
                            return res.status(500).send('Unable to scan directory: ' + err);
                        }
                        const questionFiles = files.filter(file => file.endsWith('.png'));
                        res.json(questionFiles);
                    });
                });

                console.log(`Route created: ${routePath}`);
            }
        });

        app.get('/folders.json', (req, res) => {
            res.json(folders);
        });
    });
};

// Create routes for each folder in the data directory
createRoutesForFolders(dataFolder);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
