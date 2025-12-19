const API_URL = "/api/content";

document.addEventListener("DOMContentLoaded", () => {
    // Check Auth
    let user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    // Fetch and Display Content
    getContent();
});

async function getContent() {
    try {
        let res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch data");
        let data = await res.json();
        showContent(data);
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("container").innerHTML = "<p>Error loading content.</p>";
    }
}

function showContent(data) {
    let container = document.getElementById("container");
    container.innerHTML = "";

    if (data.length === 0) {
        container.innerHTML = "<p>No content available to display.</p>";
        return;
    }

    data.forEach(item => {
        let card = document.createElement("div");
        card.innerHTML = `
            <img src="${item.image || 'https://via.placeholder.com/150'}" alt="Image">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
        `;
        container.appendChild(card);
    });
}