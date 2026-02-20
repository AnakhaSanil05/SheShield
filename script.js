// ==========================
// STEP 2: Trusted Contacts
// ==========================
let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

function renderContacts() {
    const list = document.getElementById("contactList");
    list.innerHTML = "";
    contacts.forEach((c, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${c.name} - ${c.number} 
        <button onclick="deleteContact(${index})">Delete</button>`;
        list.appendChild(li);
    });
}

function deleteContact(index) {
    contacts.splice(index, 1);
    localStorage.setItem("contacts", JSON.stringify(contacts));
    renderContacts();
}

document.getElementById("addContact").addEventListener("click", () => {
    const name = document.getElementById("name").value;
    const number = document.getElementById("number").value;

    if(name && number){
        contacts.push({name, number});
        localStorage.setItem("contacts", JSON.stringify(contacts));
        renderContacts();
        document.getElementById("name").value = "";
        document.getElementById("number").value = "";
    } else {
        alert("Enter name and number (+CountryCode)");
    }
});

renderContacts();


// ==========================
// STEP 1: SOS via WhatsApp
// ==========================
document.getElementById("sosBtn").addEventListener("click", () => {
    if(contacts.length === 0){
        alert("Add at least one trusted contact!");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const mapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

        const message = `🚨 EMERGENCY ALERT 🚨
I need help immediately!
My Location: ${mapsLink}
Time: ${new Date().toLocaleString()}
Please respond ASAP.`;

        // Desktop preview
        document.getElementById("preview").innerHTML =
        `<textarea>${message}</textarea>`;

        // Open WhatsApp for first contact
        const first = contacts[0];
        const waLink = `https://wa.me/${first.number}?text=${encodeURIComponent(message)}`;
        window.open(waLink, "_blank");

        alert("SOS Triggered!");

    }, () => {
        alert("Please allow location access.");
    });
});


// ==========================
// STEP 3 & 4: Safe Walk Mode
// ==========================
let interval;
let timeLeft;

document.getElementById("startWalk").addEventListener("click", () => {

    const mins = parseInt(document.getElementById("minutes").value);

    if(!mins){
        alert("Enter walk duration");
        return;
    }

    timeLeft = mins * 60;

    document.getElementById("startWalk").style.display = "none";
    document.getElementById("safeBtn").style.display = "inline";

    interval = setInterval(() => {

        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        document.getElementById("timer").innerText = `${m}m ${s}s remaining`;

        if(timeLeft <= 0){
            clearInterval(interval);
            autoSOS();
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

function autoSOS(){
    alert("Safe Walk time expired! Triggering SOS...");
    document.getElementById("sosBtn").click();
}
