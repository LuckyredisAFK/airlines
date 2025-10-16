// ✈️ Available schedules (Japan ↔ Philippines only)
// Generate 3 flights per day for Oct 16–31 for both directions
function generateFlights(from, to) {
    const flights = [];
    const times = ["08:00", "13:00", "18:00"];
    const terminals = ["Terminal 1", "Terminal 2", "Terminal 3"];
    const carriers = ["5J", "PR", "CX", "JL"];
    for (let day = 16; day <= 31; day++) {
        const dd = String(day).padStart(2, '0');
        for (let i = 0; i < 3; i++) {
            const carrier = carriers[(day + i) % carriers.length];
            flights.push({
                flightNo: `${carrier} ${day}${i+1}`,
                from,
                to,
                departDate: `2025-10-${dd}`,
                departTime: times[i],
                price: 0,
                seats: 3 + ((day + i) % 6),
                hours: 4 + (i % 2 ? 0.5 : 0),
                fareType: ((day + i) % 3 === 0) ? "Promo Fare" : "None",
                terminal: terminals[i]
            });
        }
    }
    return flights;
}

const schedules = [
    ...generateFlights("Japan", "Philippines"),
    ...generateFlights("Philippines", "Japan")
];

// Store selected flights separately for round-trip
let selectedDepartFlight = null;
let selectedReturnFlight = null;

function formatCurrency(n) {
    return '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function daysUntil(dateStr) {
    const today = new Date();
    const dep = new Date(dateStr);
    today.setHours(0,0,0,0);
    dep.setHours(0,0,0,0);
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.max(0, Math.round((dep - today) / msPerDay));
}

function computeRealisticPrice(flight, dateStr) {
    // Philippine market tuned baseline for PH ↔ JP one-way economy
    let base = 12000; // starting PHP fare

    const days = daysUntil(dateStr);
    if (days <= 2) base *= 1.45;         // last-minute
    else if (days <= 7) base *= 1.25;
    else if (days <= 14) base *= 1.12;
    else if (days >= 60) base *= 0.9;    // early-bird

    // Seat availability
    if (flight.seats <= 3) base *= 1.18;
    else if (flight.seats <= 5) base *= 1.08;
    else if (flight.seats >= 8) base *= 0.95;

    // Weekend (Fri/Sun) bump
    const dow = new Date(dateStr).getDay();
    if (dow === 5 || dow === 0) base *= 1.08;

    // Promo fares get discount
    if ((flight.fareType || '').toLowerCase().includes('promo')) base *= 0.85;

    // Small per-flight variation ±3%
    const hash = Array.from(flight.flightNo).reduce((s,c)=>s+c.charCodeAt(0),0);
    base *= (1 + ((hash % 7) - 3) * 0.01);

    // Clamp to realistic range and round to nearest 10
    base = Math.max(8000, Math.min(32000, base));
    return Math.round(base / 10) * 10;
}

document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const departDate = document.getElementById('departDate').value;
    const returnDate = document.getElementById('returnDate').value;
    const tripType = document.querySelector('input[name="tripType"]:checked').value;
    const flightResults = document.getElementById('flightResults');
    const resultsSection = document.getElementById('resultsSection');

    flightResults.innerHTML = "";

    if (tripType === "oneway") {
        // One-way flight filter
        const availableFlights = schedules.filter(
            f => f.from === from && f.to === to && f.departDate === departDate
        );

        if (availableFlights.length === 0) {
            flightResults.innerHTML = "<p>No flights available for your selection.</p>";
        } else {
            availableFlights.forEach((flight, idx) => {
                const computedPrice = computeRealisticPrice(flight, departDate);
                flightResults.innerHTML += `
                    <div class="flight-card">
                        <div class="flight-details">
                            <strong>Flight No:</strong> ${flight.flightNo} <br>
                            <strong>From:</strong> ${flight.from} <strong>To:</strong> ${flight.to} <br>
                            <strong>Depart:</strong> ${flight.departDate} ${flight.departTime} <br>
                            <strong>Price:</strong> ${formatCurrency(computedPrice)} <br>
                            <strong>Seats Available:</strong> ${flight.seats} <br>
                            <strong>Travel Time:</strong> ${flight.hours} hours <br>
                            <strong>Fare Type:</strong> ${flight.fareType} <br>
                            <strong>Terminal:</strong> ${flight.terminal}
                        </div>
                        <button class="select-btn" onclick="selectFlight(${idx}, 'depart')">Select</button>
                    </div>
                `;
            });
        }
    } else {
        // Round-trip flight filter
        const availableDepartFlights = schedules.filter(
            f => f.from === from && f.to === to && f.departDate === departDate
        );
        const availableReturnFlights = schedules.filter(
            f => f.from === to && f.to === from && f.departDate === returnDate
        );

        flightResults.innerHTML += "<h3>Depart Flights</h3>";
        if (availableDepartFlights.length === 0) flightResults.innerHTML += "<p>No depart flights available.</p>";
        availableDepartFlights.forEach((flight, idx) => {
            const computedPrice = computeRealisticPrice(flight, departDate);
            flightResults.innerHTML += `
                <div class="flight-card">
                    <div class="flight-details">
                        <strong>Flight No:</strong> ${flight.flightNo} <br>
                        <strong>From:</strong> ${flight.from} <strong>To:</strong> ${flight.to} <br>
                        <strong>Depart:</strong> ${flight.departDate} ${flight.departTime} <br>
                        <strong>Price:</strong> ${formatCurrency(computedPrice)} <br>
                        <strong>Seats Available:</strong> ${flight.seats} <br>
                        <strong>Travel Time:</strong> ${flight.hours} hours <br>
                        <strong>Fare Type:</strong> ${flight.fareType} <br>
                        <strong>Terminal:</strong> ${flight.terminal}
                    </div>
                    <button class="select-btn" onclick="selectFlight(${idx}, 'depart')">Select Depart Flight</button>
                </div>
            `;
        });

        flightResults.innerHTML += "<h3>Return Flights</h3>";
        if (availableReturnFlights.length === 0) flightResults.innerHTML += "<p>No return flights available.</p>";
        availableReturnFlights.forEach((flight, idx) => {
            const computedPrice = computeRealisticPrice(flight, returnDate);
            flightResults.innerHTML += `
                <div class="flight-card">
                    <div class="flight-details">
                        <strong>Flight No:</strong> ${flight.flightNo} <br>
                        <strong>From:</strong> ${flight.from} <strong>To:</strong> ${flight.to} <br>
                        <strong>Depart:</strong> ${flight.departDate} ${flight.departTime} <br>
                        <strong>Price:</strong> ${formatCurrency(computedPrice)} <br>
                        <strong>Seats Available:</strong> ${flight.seats} <br>
                        <strong>Travel Time:</strong> ${flight.hours} hours <br>
                        <strong>Fare Type:</strong> ${flight.fareType} <br>
                        <strong>Terminal:</strong> ${flight.terminal}
                    </div>
                    <button class="select-btn" onclick="selectFlight(${idx}, 'return')">Select Return Flight</button>
                </div>
            `;
        });
    }

    // show result section
    resultsSection.style.display = "block";
});

// 🧳 Handle selecting flights
window.selectFlight = function(idx, type) {
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const departDate = document.getElementById('departDate').value;
    const returnDate = document.getElementById('returnDate').value;
    const tripType = document.querySelector('input[name="tripType"]:checked').value;

    if (tripType === "oneway") {
        const baseFlight = schedules.filter(f => f.from === from && f.to === to && f.departDate === departDate)[idx];
        const computedPrice = computeRealisticPrice(baseFlight, departDate);
        const flight = { ...baseFlight, price: computedPrice };
        // persist passenger counts from search form
        const adults = parseInt(document.getElementById('adults').value || '1');
        const children = parseInt(document.getElementById('children').value || '0');
        const infants = parseInt(document.getElementById('infants').value || '0');
        localStorage.setItem('passengerCounts', JSON.stringify({ adults, children, infants }));
        localStorage.setItem('selectedFlight', JSON.stringify(flight));
        window.location.href = "booking.html";
    } else {
        if (type === 'depart') {
            const baseFlight = schedules.filter(f => f.from === from && f.to === to && f.departDate === departDate)[idx];
            const computedPrice = computeRealisticPrice(baseFlight, departDate);
            selectedDepartFlight = { ...baseFlight, price: computedPrice };
            alert("✅ Depart flight selected. Now select your return flight.");
        } else if (type === 'return') {
            const baseFlight = schedules.filter(f => f.from === to && f.to === from && f.departDate === returnDate)[idx];
            const computedPrice = computeRealisticPrice(baseFlight, returnDate);
            selectedReturnFlight = { ...baseFlight, price: computedPrice };
            // persist passenger counts from search form at finalization
            const adults = parseInt(document.getElementById('adults').value || '1');
            const children = parseInt(document.getElementById('children').value || '0');
            const infants = parseInt(document.getElementById('infants').value || '0');
            localStorage.setItem('passengerCounts', JSON.stringify({ adults, children, infants }));
            localStorage.setItem('selectedFlight', JSON.stringify({
                depart: selectedDepartFlight,
                return: selectedReturnFlight
            }));
            window.location.href = "booking.html";
        }
    }
};
