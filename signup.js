async function signup() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (!name || !email || !password) {
        alert("All fields are required");
        return;
    }

    let obj = {
        name,
        email,
        password
        // image removed
    };

    try {
        let res = await fetch("http://localhost:3002/api/users/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        });

        if (res.ok) {
            alert("Signup Successful");
            window.location.href = "index.html";
        } else {
            let msg = await res.json();
            alert(msg.error || "Signup Failed");
        }
    } catch (error) {
        console.error(error);
        alert("Something went wrong");
    }
}
