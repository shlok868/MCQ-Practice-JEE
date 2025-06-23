const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3030;
const dataFolder = path.join(__dirname, 'public', 'data');

app.use(express.static('public'));
app.use(bodyParser.json());

// List all folders in /data
app.get('/folders.json', (req, res) => {
    fs.readdir(dataFolder, { withFileTypes: true }, (err, items) => {
        if (err) return res.status(500).json({ error: err.message });
        const folders = items.filter(item => item.isDirectory()).map(item => item.name);
        res.json(folders);
    });
});

// List all tests in a folder (each test is a subfolder containing ans.json)
app.get('/folders/:folder/tests.json', (req, res) => {
    const folderPath = path.join(dataFolder, req.params.folder);
    fs.readdir(folderPath, { withFileTypes: true }, (err, items) => {
        if (err) return res.status(500).json({ error: err.message });
        // Only include subfolders that contain ans.json
        const testFolders = items
            .filter(item => item.isDirectory())
            .map(item => item.name)
            .filter(subfolder => fs.existsSync(path.join(folderPath, subfolder, 'ans.json')));
        res.json(testFolders);
    });
});

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

// Save answers
app.post('/save-answers', (req, res) => {
    const { testPath, answers } = req.body;
    const savePath = path.join(dataFolder, testPath, 'saved_answers.json');
    fs.writeFile(savePath, JSON.stringify(answers), err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Load answers
app.get('/load-answers', (req, res) => {
    const testPath = req.query.testPath;
    const savePath = path.join(dataFolder, testPath, 'saved_answers.json');
    fs.readFile(savePath, (err, data) => {
        if (err) return res.json([]); // Return empty if not found
        res.json(JSON.parse(data));
    });
});

// Clear answers
app.post('/clear-answers', (req, res) => {
    const { testPath, totalQuestions } = req.body;
    const savePath = path.join(dataFolder, testPath, 'saved_answers.json');
    const blankAnswers = Array(totalQuestions).fill(null);
    fs.writeFile(savePath, JSON.stringify(blankAnswers), err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});
// server/index.js or your main server file

// Listen on all interfaces
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${port}`);
});

app.get('/api/list', (req, res) => {
    const relPath = req.query.path || '';
    const absPath = path.join(dataFolder, relPath);

    fs.readdir(absPath, { withFileTypes: true }, (err, items) => {
        if (err) return res.status(500).json({ error: err.message });

        const folders = [];
        const exams = [];

        items.forEach(item => {
            if (item.isDirectory()) {
                const ansPath = path.join(absPath, item.name, 'ans.json');
                if (fs.existsSync(ansPath)) {
                    exams.push(item.name);
                } else {
                    folders.push(item.name);
                }
            }
        });

        res.json({ folders, exams });
    });
});
