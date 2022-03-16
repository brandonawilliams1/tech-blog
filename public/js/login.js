const loginFormHandler = async(event) => {
    event.preventDefault();
    const email = document.querySelector("#email-login").value.trim();
    const password = document.querySelector("#password-login").value.trim();

    if (email && password) { // Send a POST request to the API endpoint
        const response = await fetch("/api/Author/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" },
        });

        // If successful, redirect the browser to the dashboard page
        (response.ok) ? document.location.replace("/dashboard"): alert(response.statusText);
    }
};

document.querySelector(".login-form").addEventListener("submit", loginFormHandler);