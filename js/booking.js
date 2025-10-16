// Get selected flight from localStorage
const selectedFlight = JSON.parse(localStorage.getItem('selectedFlight'));
const flightSummaryDiv = document.getElementById('flightSummary');
const passengerFieldsDiv = document.getElementById('passengerFields');
const passengerCounts = JSON.parse(localStorage.getItem('passengerCounts')) || { adults: 1, children: 0, infants: 0 };
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
            <strong>Price:</strong> ₱${Number(selectedFlight.depart.price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br>
            <strong>Seats Available:</strong> ${selectedFlight.depart.seats}<br>
            <strong>Travel Time:</strong> ${selectedFlight.depart.hours} hours<br>

            <h3>Selected Return Flight</h3>
            <strong>Flight No:</strong> ${selectedFlight.return.flightNo}<br>
            <strong>From:</strong> ${selectedFlight.return.from} <strong>To:</strong> ${selectedFlight.return.to}<br>
            <strong>Depart:</strong> ${selectedFlight.return.departDate} ${selectedFlight.return.departTime}<br>
            <strong>Price:</strong> ₱${Number(selectedFlight.return.price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br>
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
            <strong>Price:</strong> ₱${Number(selectedFlight.price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br>
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
                <label for="passengerName${i}">Full Name</label>
                <input type="text" id="passengerName${i}" name="passengerName${i}" required>
                <label for="passengerAddress${i}">Address</label>
                <input type="text" id="passengerAddress${i}" name="passengerAddress${i}" required>
                <label for="passengerPhone${i}">Contact Number</label>
                <input type="tel" id="passengerPhone${i}" name="passengerPhone${i}" inputmode="numeric" pattern="[0-9]{11}" minlength="11" maxlength="11" placeholder="11-digit mobile" required>
                <label for="passengerEmail${i}">Email</label>
                <input type="email" id="passengerEmail${i}" name="passengerEmail${i}" required>
                <label for="passengerAge${i}">Age</label>
                <input type="number" id="passengerAge${i}" name="passengerAge${i}" min="0" required>
            </div>
        `;
    }
}

// Decide total passengers from counts provided at search step (infants don't need separate contact fields)
const totalPassengers = Math.max(1, Number(passengerCounts.adults || 0) + Number(passengerCounts.children || 0));
renderPassengerFields(totalPassengers);

// Handle form submit
bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const num = totalPassengers;
    const passengers = [];
    let valid = true;
    for (let i = 1; i <= num; i++) {
        const nameEl = document.getElementById(`passengerName${i}`);
        const addressEl = document.getElementById(`passengerAddress${i}`);
        const phoneEl = document.getElementById(`passengerPhone${i}`);
        const ageEl = document.getElementById(`passengerAge${i}`);
        const emailEl = document.getElementById(`passengerEmail${i}`);

        const name = nameEl ? nameEl.value.trim() : '';
        const address = addressEl ? addressEl.value.trim() : '';
        const phone = phoneEl ? phoneEl.value.trim() : '';
        const age = ageEl ? ageEl.value.trim() : '';
        const email = emailEl ? emailEl.value.trim() : '';

        const phoneOk = /^\d{11}$/.test(phone);
        if (!name || !address || !phone || !phoneOk || !age || !email) valid = false;
        passengers.push({ name, address, phone, age, email });
    }
    if (!valid) {
        alert("Please fill all passenger info.");
        return;
    }
    localStorage.setItem('passengers', JSON.stringify(passengers));
    localStorage.setItem('numPassengers', num);
    localStorage.setItem('passengerCounts', JSON.stringify(passengerCounts));
    window.location.href = "summary.html";
});


