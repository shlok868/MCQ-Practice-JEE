// server/gitAutoPush.js

const { exec } = require('child_process');
const path = require('path');

// Path to your repo root
const REPO_DIR = path.resolve(__dirname, '..');

function pushToGitHub() {
  const timestamp = new Date().toISOString();
  const commitMessage = `"Auto-push at ${timestamp}"`;

  const commands = `
    cd ${REPO_DIR} &&
    git add server/data/userAnswers.json &&
    git commit -m ${commitMessage} || echo "No changes to commit" &&
    git push https://${process.env.GITHUB_TOKEN}@github.com/shlok868/MCQ-Practice-JEE.git main
  `;

  exec(commands, (error, stdout, stderr) => {
    if (error) {
      console.error('Error pushing to GitHub:', error.message);
      return;
    }
    if (stderr) console.error('Git stderr:', stderr);
    console.log('Git stdout:', stdout);
  });
}