const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        formStatus.textContent = "Please fill in all fields.";
        return;
    }

    formStatus.textContent = "Sending...";

    try {
        const response = await fetch("https://portfolio-backend-xmym.onrender.com/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                message
            })
        });

        const data = await response.json();

        if (response.ok) {
            formStatus.textContent = data.message;
            contactForm.reset();
        } else {
            formStatus.textContent = "Something went wrong.";
        }

    } catch (error) {
        formStatus.textContent = "Unable to connect to the server.";
        console.error(error);
    }
});