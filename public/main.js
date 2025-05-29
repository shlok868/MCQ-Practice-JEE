// Use the same icon for all folders/exams
const folderIconUrl = "https://img.icons8.com/fluency/96/folder-invoices.png";
const examIconUrl = "https://img.icons8.com/fluency/96/test-passed.png";

let currentPath = "";

async function loadFolders(path = "") {
    currentPath = path;
    const res = await fetch(`/api/list?path=${encodeURIComponent(path)}`);
    const data = await res.json();

    const subjectsDiv = document.getElementById('subjects');
    subjectsDiv.innerHTML = "";

    // Render folders
    data.folders.forEach(folder => {
        const card = document.createElement("div");
        card.className = "folder-card";
        card.onclick = () => loadFolders(path ? `${path}/${folder}` : folder);

        const icon = document.createElement("img");
        icon.className = "folder-icon";
        icon.src = folderIconUrl;

        const title = document.createElement("div");
        title.className = "folder-title";
        title.textContent = folder;

        card.appendChild(icon);
        card.appendChild(title);
        subjectsDiv.appendChild(card);
    });

    // Render exams
    data.exams.forEach(exam => {
        const card = document.createElement("div");
        card.className = "folder-card";
        card.onclick = () => window.location.href = `exam.html?folder=${encodeURIComponent(path ? `${path}/${exam}` : exam)}`;

        const icon = document.createElement("img");
        icon.className = "folder-icon";
        icon.src = examIconUrl;

        const title = document.createElement("div");
        title.className = "folder-title";
        title.textContent = exam;
        title.style.fontWeight = "700";
        title.style.color = "#fff";

        card.appendChild(icon);
        card.appendChild(title);
        subjectsDiv.appendChild(card);
    });

    // Show/hide back button
    document.getElementById('back-to-folders-btn').style.display = path ? "" : "none";
}

// Back button logic
document.getElementById('back-to-folders-btn').onclick = function() {
    if (!currentPath) return;
    const parts = currentPath.split('/');
    parts.pop();
    loadFolders(parts.join('/'));
};

// Search logic (optional, simple folder/exam name filter)
document.getElementById("exam-search").addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    Array.from(document.querySelectorAll('.folder-card')).forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(query) ? "" : "none";
    });
});

// On page load
document.addEventListener("DOMContentLoaded", () => {
    loadFolders();
});