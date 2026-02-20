// Trusted Contacts
let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

function renderContacts() {
    const list = document.getElementById("contactList");
    list.innerHTML = "";

    contacts.forEach((c, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${c.name} - ${c.number} <button onclick="deleteContact(${index})">Delete</button>`;
        list.appendChild(li);
    });
}

function deleteContact(index) {
    contacts.splice(index, 1);
    localStorage.setItem("contacts", JSON.stringify(contacts));
    renderContacts();
}

document.getElementById("addContact").addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const number = document.getElementById("number").value.trim();

    if (name && number) {
        const cleanNumber = number.replace(/\D/g, "");
        contacts.push({ name, number: cleanNumber });
        localStorage.setItem("contacts", JSON.stringify(contacts));
        renderContacts();
        document.getElementById("name").value = "";
        document.getElementById("number").value = "";
    } else {
        alert("Enter name and phone number");
    }
});

renderContacts();

// SOS via WhatsApp
document.getElementById("sosBtn").addEventListener("click", () => {
    if (contacts.length === 0) {
        alert("Add at least one trusted contact!");
        return;
    }

    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const mapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

        const message = `🚨 EMERGENCY ALERT 🚨
I need help immediately!
My live location: ${mapsLink}
Time: ${new Date().toLocaleString()}
Please respond ASAP.`;

        document.getElementById("preview").innerHTML = `<textarea>${message}</textarea>`;

        const cleanNumber = contacts[0].number;
        const waLink = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(message)}`;
        window.location.href = waLink;

    }, () => {
        alert("Please allow location access.");
    });
});

// Safe Walk
let interval;
let timeLeft;

document.getElementById("startWalk").addEventListener("click", () => {
    const mins = parseInt(document.getElementById("minutes").value);

    if (!mins || mins <= 0) {
        alert("Enter valid duration");
        return;
    }

    timeLeft = mins * 60;
    document.getElementById("startWalk").style.display = "none";
    document.getElementById("safeBtn").style.display = "inline";

    interval = setInterval(() => {
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        document.getElementById("timer").innerText = `${m}m ${s}s remaining`;

        if (timeLeft <= 0) {
            clearInterval(interval);
            triggerAutoSOS();
        }

        timeLeft--;
    }, 1000);
});

document.getElementById("safeBtn").addEventListener("click", () => {
    clearInterval(interval);
    document.getElementById("timer").innerText = "You reached safely!";
    document.getElementById("startWalk").style.display = "inline";
    document.getElementById("safeBtn").style.display = "none";
});

function triggerAutoSOS() {
    alert("Safe Walk time expired! Triggering SOS...");
    document.getElementById("sosBtn").click();
}