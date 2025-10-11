// Available schedules (Japan ↔ Philippines only)
const schedules = [
    // One-way: Japan → Philippines
    { flightNo: "5J 560", from: "Japan", to: "Philippines", departDate: "2025-10-20", departTime: "08:00", price: 350, seats: 5, hours: 4, fareType: "Promo Fare", terminal: "Terminal 1" },
    { flightNo: "PR 432", from: "Japan", to: "Philippines", departDate: "2025-10-21", departTime: "13:00", price: 400, seats: 3, hours: 4.5, fareType: "None", terminal: "Terminal 2" },
    { flightNo: "5J 561", from: "Japan", to: "Philippines", departDate: "2025-10-22", departTime: "18:00", price: 220, seats: 7, hours: 4, fareType: "Promo Fare", terminal: "Terminal 3" },
    { flightNo: "PR 433", from: "Japan", to: "Philippines", departDate: "2025-10-23", departTime: "10:00", price: 360, seats: 6, hours: 4, fareType: "None", terminal: "Terminal 1" },

    // One-way: Philippines → Japan
    { flightNo: "CX 900", from: "Philippines", to: "Japan", departDate: "2025-10-24", departTime: "09:00", price: 300, seats: 6, hours: 4.2, fareType: "None", terminal: "Terminal 1" },
    { flightNo: "JL 745", from: "Philippines", to: "Japan", departDate: "2025-10-25", departTime: "15:00", price: 320, seats: 4, hours: 4, fareType: "Promo Fare", terminal: "Terminal 2" },
    { flightNo: "CX 901", from: "Philippines", to: "Japan", departDate: "2025-10-26", departTime: "11:00", price: 310, seats: 5, hours: 4.1, fareType: "None", terminal: "Terminal 3" },
    { flightNo: "JL 746", from: "Philippines", to: "Japan", departDate: "2025-10-27", departTime: "16:00", price: 330, seats: 4, hours: 4, fareType: "Promo Fare", terminal: "Terminal 2" },

    // Round-trip examples (depart + return)
    // Depart Japan → Philippines, Return Philippines → Japan
    { flightNo: "5J 562", from: "Japan", to: "Philippines", departDate: "2025-10-20", departTime: "12:00", price: 355, seats: 5, hours: 4, fareType: "Promo Fare", terminal: "Terminal 2" },
    { flightNo: "CX 902", from: "Philippines", to: "Japan", departDate: "2025-10-24", departTime: "14:00", price: 305, seats: 6, hours: 4.2, fareType: "None", terminal: "Terminal 1" },

    { flightNo: "5J 563", from: "Japan", to: "Philippines", departDate: "2025-10-21", departTime: "09:00", price: 365, seats: 5, hours: 4, fareType: "None", terminal: "Terminal 1" },
    { flightNo: "JL 747", from: "Philippines", to: "Japan", departDate: "2025-10-25", departTime: "13:00", price: 315, seats: 4, hours: 4, fareType: "Promo Fare", terminal: "Terminal 2" },

    { flightNo: "5J 564", from: "Japan", to: "Philippines", departDate: "2025-10-22", departTime: "17:00", price: 370, seats: 5, hours: 4, fareType: "Promo Fare", terminal: "Terminal 3" },
    { flightNo: "CX 903", from: "Philippines", to: "Japan", departDate: "2025-10-26", departTime: "10:00", price: 310, seats: 5, hours: 4, fareType: "None", terminal: "Terminal 1" },

    { flightNo: "5J 565", from: "Japan", to: "Philippines", departDate: "2025-10-23", departTime: "08:30", price: 380, seats: 5, hours: 4, fareType: "None", terminal: "Terminal 2" },
    { flightNo: "JL 748", from: "Philippines", to: "Japan", departDate: "2025-10-27", departTime: "12:00", price: 320, seats: 4, hours: 4, fareType: "Promo Fare", terminal: "Terminal 2" }
];


// Store selected flights separately for round-trip
let selectedDepartFlight = null;
let selectedReturnFlight = null;

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
        // Filter flights for one-way
        const availableFlights = schedules.filter(f => f.from === from && f.to === to && f.departDate === departDate);

        if (availableFlights.length === 0) {
            flightResults.innerHTML = "<p>No flights available for your selection.</p>";
        } else {
            availableFlights.forEach((flight, idx) => {
                flightResults.innerHTML += `
                    <div class="flight-card">
                        <div class="flight-details">
                            <strong>Flight No:</strong> ${flight.flightNo} <br>
                            <strong>From:</strong> ${flight.from} <strong>To:</strong> ${flight.to} <br>
                            <strong>Depart:</strong> ${flight.departDate} ${flight.departTime} <br>
                            <strong>Price:</strong> $${flight.price} <br>
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
        // Round-trip
        const availableDepartFlights = schedules.filter(f => f.from === from && f.to === to && f.departDate === departDate);
        const availableReturnFlights = schedules.filter(f => f.from === to && f.to === from && f.departDate === returnDate);

        flightResults.innerHTML += "<h3>Depart Flights</h3>";
        if (availableDepartFlights.length === 0) flightResults.innerHTML += "<p>No depart flights available.</p>";
        availableDepartFlights.forEach((flight, idx) => {
            flightResults.innerHTML += `
                <div class="flight-card">
                    <div class="flight-details">
                        <strong>Flight No:</strong> ${flight.flightNo} <br>
                        <strong>From:</strong> ${flight.from} <strong>To:</strong> ${flight.to} <br>
                        <strong>Depart:</strong> ${flight.departDate} ${flight.departTime} <br>
                        <strong>Price:</strong> $${flight.price} <br>
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
            flightResults.innerHTML += `
                <div class="flight-card">
                    <div class="flight-details">
                        <strong>Flight No:</strong> ${flight.flightNo} <br>
                        <strong>From:</strong> ${flight.from} <strong>To:</strong> ${flight.to} <br>
                        <strong>Depart:</strong> ${flight.departDate} ${flight.departTime} <br>
                        <strong>Price:</strong> $${flight.price} <br>
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

    resultsSection.style.display = "block";
});

// Handle selecting flights
window.selectFlight = function(idx, type) {
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const departDate = document.getElementById('departDate').value;
    const returnDate = document.getElementById('returnDate').value;
    const tripType = document.querySelector('input[name="tripType"]:checked').value;

    if (tripType === "oneway") {
        const flight = schedules.filter(f => f.from === from && f.to === to && f.departDate === departDate)[idx];
        localStorage.setItem('selectedFlight', JSON.stringify(flight));
        window.location.href = "booking.html";
    } else {
        if (type === 'depart') {
            selectedDepartFlight = schedules.filter(f => f.from === from && f.to === to && f.departDate === departDate)[idx];
            alert("Depart flight selected. Now select return flight.");
        } else if (type === 'return') {
            selectedReturnFlight = schedules.filter(f => f.from === to && f.to === from && f.departDate === returnDate)[idx];
            // Save both flights
            localStorage.setItem('selectedFlight', JSON.stringify({
                depart: selectedDepartFlight,
                return: selectedReturnFlight
            }));
            window.location.href = "booking.html";
        }
    }
};
