// Use the same icon for all folders/exams
const folderIconUrl = "https://img.icons8.com/fluency/96/folder-invoices.png";
const examIconUrl = "https://img.icons8.com/fluency/96/test-passed.png"; // Paper-like icon

let allFolders = [];
let allExams = {};
let currentView = "folders";
let currentFolder = null;

function fetchFoldersAndExams() {
    fetch('/folders.json')
        .then(res => res.json())
        .then(folders => {
            allFolders = folders;
            // For each folder, fetch its exams
            let promises = folders.map(folder =>
                fetch(`/folders/${folder}/tests.json`)
                    .then(res => res.json())
                    .then(exams => {
                        allExams[folder] = exams;
                    })
            );
            Promise.all(promises).then(() => renderFolders());
        });
}

function renderFolders() {
    currentView = "folders";
    currentFolder = null;
    document.querySelector('.main-title').textContent = "My Exams";
    document.querySelector('.section h2').textContent = "Subjects"; // Reset section title
    document.querySelector('.search-bar-row').style.display = "flex";
    document.getElementById("back-to-folders-btn").style.display = "none";
    const subjects = ["Physics", "Chemistry", "Maths"];
    const other = allFolders.filter(f => !subjects.includes(f));
    renderFolderGrid("subjects", subjects, folderIconUrl);
    renderFolderGrid("other", other, folderIconUrl);
}

function renderFolderGrid(containerId, folders, iconUrl) {
    const grid = document.getElementById(containerId);
    grid.innerHTML = "";
    grid.classList.remove("exam-grid");
    folders.forEach((folder) => {
        const card = document.createElement("div");
        card.className = "folder-card";
        card.onclick = () => openFolder(folder);

        const icon = document.createElement("img");
        icon.className = "folder-icon";
        icon.src = iconUrl;

        const title = document.createElement("div");
        title.className = "folder-title";
        title.textContent = folder;

        const meta = document.createElement("div");
        meta.className = "folder-meta";
        meta.textContent = `${allExams[folder]?.length || 0} exams`;

        card.appendChild(icon);
        card.appendChild(title);
        card.appendChild(meta);
        grid.appendChild(card);
    });
}

function openFolder(folder) {
    currentView = "exams";
    currentFolder = folder;
    document.querySelector('.main-title').textContent = "My Exams";
    document.querySelector('.section h2').textContent = "Exams";
    document.querySelector('.search-bar-row').style.display = "flex";
    const grid = document.getElementById("subjects");
    const otherGrid = document.getElementById("other");
    grid.innerHTML = "";
    otherGrid.innerHTML = "";
    grid.classList.add("exam-grid");

    // Show the navbar back button
    document.getElementById("back-to-folders-btn").style.display = "inline-block";

    const exams = allExams[folder] || [];
    exams.forEach((exam) => {
        const card = document.createElement("div");
        card.className = "folder-card";

        card.onclick = () => window.location.href = `exam.html?folder=${folder}/${exam}`;

        const icon = document.createElement("img");
        icon.className = "folder-icon";
        icon.src = examIconUrl;

        const title = document.createElement("div");
        title.className = "folder-title";
        title.textContent = exam;
        title.style.fontWeight = "700"; // Make exam title bold
        title.style.color = "#fff";     // Make exam title white

        card.appendChild(icon);
        card.appendChild(title);
        grid.appendChild(card);
    });
}

function filterFoldersAndExams(query) {
    query = query.toLowerCase();
    if (currentView === "folders") {
        // Filter folders by name or exam name
        const subjects = ["Physics", "Chemistry", "Maths", "Mock Tests"];
        const filteredSubjects = subjects.filter(f =>
            f.toLowerCase().includes(query) ||
            (allExams[f] || []).some(e => e.toLowerCase().includes(query))
        );
        const filteredOther = allFolders.filter(f =>
            !subjects.includes(f) &&
            (f.toLowerCase().includes(query) ||
            (allExams[f] || []).some(e => e.toLowerCase().includes(query)))
        );
        renderFolderGrid("subjects", filteredSubjects, folderIconUrl);
        renderFolderGrid("other", filteredOther, folderIconUrl);
    } else if (currentView === "exams" && currentFolder) {
        // Filter exams in current folder
        const grid = document.getElementById("subjects");
        grid.innerHTML = "";
        grid.classList.add("exam-grid");
        const exams = (allExams[currentFolder] || []).filter(e => e.toLowerCase().includes(query));
        exams.forEach((exam) => {
            const card = document.createElement("div");
            card.className = "folder-card";
            card.onclick = () => window.location.href = `exam.html?folder=${currentFolder}/${exam}`;

            const icon = document.createElement("img");
            icon.className = "folder-icon";
            icon.src = examIconUrl;

            const title = document.createElement("div");
            title.className = "folder-title";
            title.textContent = exam;

            card.appendChild(icon);
            card.appendChild(title);
            grid.appendChild(card);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchFoldersAndExams();

    document.getElementById("exam-search").addEventListener("input", (e) => {
        filterFoldersAndExams(e.target.value);
    });

    // Back to Folders button logic
    const backBtn = document.getElementById("back-to-folders-btn");
    backBtn.addEventListener("click", () => {
        renderFolders();
        backBtn.style.display = "none";
    });
});