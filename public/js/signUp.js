const signupFormHandler = async(event) => {
    event.preventDefault();
    const name = document.querySelector("#name-signup").value.trim();
    const email = document.querySelector("#email-signup").value.trim();
    const password = document.querySelector("#password-signup").value.trim();

    if (name && email && password) {
        const response = await fetch("/api/Author", {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
            headers: { "Content-Type": "application/json" },
        });

        (response.ok) ? document.location.replace("/dashboard"): alert(response.statusText);
    }
};

document.querySelector(".signup-form").addEventListener("submit", signupFormHandler);