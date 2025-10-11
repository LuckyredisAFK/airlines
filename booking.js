// Get selected flight from localStorage
const selectedFlight = JSON.parse(localStorage.getItem('selectedFlight'));
const flightSummaryDiv = document.getElementById('flightSummary');
const passengerFieldsDiv = document.getElementById('passengerFields');
const numPassengersInput = document.getElementById('numPassengers');
const bookingForm = document.getElementById('bookingForm');

// Show flight summary
if (selectedFlight) {
    if (selectedFlight.depart && selectedFlight.return) {
        // Round-trip
        flightSummaryDiv.innerHTML = `
            <h3>Selected Depart Flight</h3>
            <strong>Flight No:</strong> ${selectedFlight.depart.flightNo}<br>
            <strong>From:</strong> ${selectedFlight.depart.from} <strong>To:</strong> ${selectedFlight.depart.to}<br>
            <strong>Depart:</strong> ${selectedFlight.depart.departDate} ${selectedFlight.depart.departTime}<br>
            <strong>Price:</strong> $${selectedFlight.depart.price}<br>
            <strong>Seats Available:</strong> ${selectedFlight.depart.seats}<br>
            <strong>Travel Time:</strong> ${selectedFlight.depart.hours} hours<br>

            <h3>Selected Return Flight</h3>
            <strong>Flight No:</strong> ${selectedFlight.return.flightNo}<br>
            <strong>From:</strong> ${selectedFlight.return.from} <strong>To:</strong> ${selectedFlight.return.to}<br>
            <strong>Depart:</strong> ${selectedFlight.return.departDate} ${selectedFlight.return.departTime}<br>
            <strong>Price:</strong> $${selectedFlight.return.price}<br>
            <strong>Seats Available:</strong> ${selectedFlight.return.seats}<br>
            <strong>Travel Time:</strong> ${selectedFlight.return.hours} hours<br>
        `;
    } else {
        // One-way
        flightSummaryDiv.innerHTML = `
            <h3>Selected Flight</h3>
            <strong>Flight No:</strong> ${selectedFlight.flightNo}<br>
            <strong>From:</strong> ${selectedFlight.from} <strong>To:</strong> ${selectedFlight.to}<br>
            <strong>Depart:</strong> ${selectedFlight.departDate} ${selectedFlight.departTime}<br>
            <strong>Price:</strong> $${selectedFlight.price}<br>
            <strong>Seats Available:</strong> ${selectedFlight.seats}<br>
            <strong>Travel Time:</strong> ${selectedFlight.hours} hours<br>
        `;
    }
} else {
    flightSummaryDiv.innerHTML = "<p>No flight selected. Please go back and select a flight.</p>";
    bookingForm.style.display = "none";
}

// Render passenger fields
function renderPassengerFields(num) {
    passengerFieldsDiv.innerHTML = "";
    for (let i = 1; i <= num; i++) {
        passengerFieldsDiv.innerHTML += `
            <div class="passenger-group">
                <h3>Passenger ${i}</h3>
                <label for="passengerName${i}">Name</label>
                <input type="text" id="passengerName${i}" name="passengerName${i}" required>
                ${i === 1 ? `
                <label for="passengerEmail${i}">Email</label>
                <input type="email" id="passengerEmail${i}" name="passengerEmail${i}" required>
                ` : ''}
                <label for="passengerAge${i}">Age</label>
                <input type="number" id="passengerAge${i}" name="passengerAge${i}" min="0" required>
            </div>
        `;
    }
}

// Initial render
renderPassengerFields(numPassengersInput.value);

// Update passenger fields on change
numPassengersInput.addEventListener('input', function() {
    renderPassengerFields(this.value);
});

// Handle form submit
bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const num = parseInt(numPassengersInput.value);
    const passengers = [];
    let valid = true;
    for (let i = 1; i <= num; i++) {
        const name = document.getElementById(`passengerName${i}`).value.trim();
        const age = document.getElementById(`passengerAge${i}`).value.trim();
        const email = i === 1 ? document.getElementById(`passengerEmail${i}`).value.trim() : "";
        if (!name || !age || (i === 1 && !email)) valid = false;
        passengers.push({ name, age, email });
    }
    if (!valid) {
        alert("Please fill all passenger info.");
        return;
    }
    localStorage.setItem('passengers', JSON.stringify(passengers));
    localStorage.setItem('numPassengers', num);
    window.location.href = "summary.html";
});
