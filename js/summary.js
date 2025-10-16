// Get data from localStorage
const flightData = JSON.parse(localStorage.getItem('selectedFlight'));
const passengers = JSON.parse(localStorage.getItem('passengers')) || [];
const numPassengers = parseInt(localStorage.getItem('numPassengers')) || passengers.length || 1;

// Example package and add-ons (can be dynamic)
const packageType = "Economy";
const includedServices = ["1 checked baggage", "Meals", "In-flight entertainment"];

function formatCurrency(n) {
    return '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

let baseFare = 0;
if (flightData) {
    if (flightData.depart && flightData.return) {
        // Round-trip: sum both flights
        baseFare = (Number(flightData.depart.price) + Number(flightData.return.price)) * numPassengers;
    } else {
        baseFare = Number(flightData.price) * numPassengers;
    }
}
// Align tax precision with payment: round to cents
const taxes = Math.round(baseFare * 0.12 * 100) / 100;
const addOns = [
    { name: "Extra baggage", price: 50 * numPassengers },
    { name: "Travel insurance", price: 30 * numPassengers }
];
const addOnsTotal = addOns.reduce((sum, item) => sum + item.price, 0);
const totalAmount = Math.round((baseFare + taxes + addOnsTotal) * 100) / 100;

// Flight Details
if (flightData) {
    let flightHtml = "";
    if (flightData.depart && flightData.return) {
        // Round-trip
        flightHtml += `
            <li><strong>Depart Flight:</strong> ${flightData.depart.flightNo} (${flightData.depart.from} → ${flightData.depart.to}) on ${flightData.depart.departDate} ${flightData.depart.departTime}</li>
            <li><strong>Return Flight:</strong> ${flightData.return.flightNo} (${flightData.return.from} → ${flightData.return.to}) on ${flightData.return.departDate} ${flightData.return.departTime}</li>
        `;
    } else {
        // One-way
        flightHtml += `
            <li><strong>Flight:</strong> ${flightData.flightNo} (${flightData.from} → ${flightData.to}) on ${flightData.departDate} ${flightData.departTime}</li>
        `;
    }
    document.getElementById('flightList').innerHTML = flightHtml;
}

// Passenger Details
let passengerHtml = `<li><strong>Number of passengers:</strong> ${numPassengers}</li>`;
let ticketNumbers = JSON.parse(localStorage.getItem('ticketNumbers') || 'null');
function generateTicketNumber() {
    const prefix = '781';
    let serial = '';
    for (let i = 0; i < 10; i++) serial += Math.floor(Math.random() * 10);
    return `${prefix}-${serial}`;
}
if (!ticketNumbers || !Array.isArray(ticketNumbers) || ticketNumbers.length !== passengers.length) {
    ticketNumbers = passengers.map(() => generateTicketNumber());
    localStorage.setItem('ticketNumbers', JSON.stringify(ticketNumbers));
}

passengers.forEach((p, idx) => {
    passengerHtml += `
        <li>
            <strong>Passenger ${idx+1}:</strong> ${p.name} <br>
            <strong>Age:</strong> ${p.age || 'N/A'} <br>
            <strong>Address:</strong> ${p.address || 'N/A'} <br>
            <strong>Contact Number:</strong> ${p.phone || 'N/A'} <br>
            <strong>Email:</strong> ${p.email || 'N/A'} <br>
            <strong>Ticket No:</strong> ${ticketNumbers[idx]} <br>
        </li>
    `;
});
document.getElementById('passengerList').innerHTML = passengerHtml;

// Package Details
document.getElementById('packageList').innerHTML = `
    <li><strong>Package type:</strong> ${packageType}</li>
    <li><strong>Included services:</strong> ${includedServices.join(', ')}</li>
`;

// Cost Breakdown
let costHtml = `
    <li><strong>Base fare:</strong> ${formatCurrency(baseFare)}</li>
    <li><strong>Taxes and fees (12%):</strong> ${formatCurrency(taxes)}</li>
`;
addOns.forEach(addon => {
    costHtml += `<li><strong>Add-on (${addon.name}):</strong> ${formatCurrency(addon.price)}</li>`;
});
costHtml += `<li><strong>Total amount to pay:</strong> ${formatCurrency(totalAmount)}</li>`;
document.getElementById('costList').innerHTML = costHtml;

// Proceed to payment
document.getElementById('proceedPaymentBtn').onclick = function() {
    localStorage.setItem('totalAmount', totalAmount);
    window.location.href = "payment.html";
};


