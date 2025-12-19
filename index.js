async function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    let obj = {
        email,
        password
    };

    try {
        let res = await fetch("/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        });

        if (res.ok) {
            let user = await res.json();
            localStorage.setItem("user", JSON.stringify(user));
            alert("Login Successful");

            if (user.role === "ADMIN") {
                window.location.href = "admin_dashboard.html";
            } else {
                window.location.href = "user_dashboard.html";
            }
        } else {
            alert("Invalid Credentials");
        }
    } catch (error) {
        console.error(error);
        alert("Something went wrong. Is the backend running?");
    }
}
