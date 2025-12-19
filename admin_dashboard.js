const USERS_API = "http://localhost:3002/api/users";
const CONTENT_API = "http://localhost:3002/api/content";

// Init
document.addEventListener("DOMContentLoaded", () => {
    fetchContent();
    fetchUsers();
});

// --- Content Management ---
async function fetchContent() {
    try {
        let res = await fetch(CONTENT_API);
        let data = await res.json();
        let container = document.getElementById("content_container");
        container.innerHTML = "";

        data.forEach(item => {
            let div = document.createElement("div");
            div.className = "card";
            // Inline styles removed to allow style.css to work
            div.innerHTML = `
                <img src="${item.image || 'https://via.placeholder.com/150'}" alt="Image">
                <h4>${item.title}</h4>
                <p style="font-size:0.8rem;">${item.description || ''}</p>
                <div class="card-actions">
                    <button class="delete-btn" onclick="deleteContent(${item.id})">Delete</button>
                    <button onclick="editContent(${item.id})">Edit</button>
                </div>
            `;
            container.appendChild(div);
        });
    } catch (e) { console.error(e); }
}

async function saveContent() {
    let id = document.getElementById("c_id").value;
    let title = document.getElementById("c_title").value;
    let description = document.getElementById("c_desc").value;
    let image = document.getElementById("c_image").value;

    if (!title) return alert("Title required");

    let obj = { title, description, image };
    let method = id ? "PUT" : "POST";
    let url = id ? `${CONTENT_API}/${id}` : CONTENT_API;

    await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj)
    });

    clearContentForm();
    fetchContent();
}

async function deleteContent(id) {
    if (confirm("Delete this item?")) {
        await fetch(`${CONTENT_API}/${id}`, { method: "DELETE" });
        fetchContent();
    }
}

async function editContent(id) {
    let res = await fetch(`${CONTENT_API}/${id}`);
    let data = await res.json();
    document.getElementById("c_id").value = data.id;
    document.getElementById("c_title").value = data.title;
    document.getElementById("c_desc").value = data.description;
    document.getElementById("c_image").value = data.image;
}

function clearContentForm() {
    document.getElementById("c_id").value = "";
    document.getElementById("c_title").value = "";
    document.getElementById("c_desc").value = "";
    document.getElementById("c_image").value = "";
}


// --- User Management ---
async function fetchUsers() {
    try {
        let res = await fetch(USERS_API);
        let data = await res.json();
        let container = document.getElementById("user_container");
        container.innerHTML = "";

        data.forEach(item => {
            let div = document.createElement("div");
            div.className = "card"; // Ensure card class is present
            // Inline styles removed
            div.innerHTML = `
                <p><strong>${item.name}</strong></p>
                <p>${item.email}</p>
                <p>Role: ${item.role}</p>
                <div class="card-actions">
                    <button class="delete-btn" onclick="deleteUser(${item.id})">Delete</button>
                    <button onclick="editUser(${item.id})">Edit</button>
                </div>
            `;
            container.appendChild(div);
        });
    } catch (e) { console.error(e); }
}

async function saveUser() {
    let id = document.getElementById("u_id").value;
    let name = document.getElementById("u_name").value;
    let email = document.getElementById("u_email").value;
    let password = document.getElementById("u_password").value;
    // Removed Image
    let role = document.getElementById("u_role").value;

    if (!name || !email || !password) return alert("Missing fields");

    let obj = { name, email, password, role }; // No image
    let method = id ? "PUT" : "POST";
    let url = id ? `${USERS_API}/${id}` : USERS_API; // Correct URL

    let res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj)
    });

    if (!res.ok) {
        let err = await res.json();
        alert(err.error || "Failed");
        return;
    }

    clearUserForm();
    fetchUsers();
}

async function deleteUser(id) {
    if (confirm("Delete this user?")) {
        await fetch(`${USERS_API}/${id}`, { method: "DELETE" });
        fetchUsers();
    }
}

async function editUser(id) {
    let res = await fetch(`${USERS_API}/${id}`);
    let data = await res.json();
    document.getElementById("u_id").value = data.id;
    document.getElementById("u_name").value = data.name;
    document.getElementById("u_email").value = data.email;
    document.getElementById("u_password").value = data.password;
    // Removed Image
    document.getElementById("u_role").value = data.role;
}

function clearUserForm() {
    document.getElementById("u_id").value = "";
    document.getElementById("u_name").value = "";
    document.getElementById("u_email").value = "";
    document.getElementById("u_password").value = "";
    // Removed Image
}