// payment.js - populate receipt and enable printing

function formatCurrency(n) {
  return '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function todayIso() {
  const d = new Date();
  return d.toLocaleString();
}

(function populateReceipt() {
  const container = document.getElementById('receiptContainer');
  const flightsList = document.getElementById('flightsList');
  const passengersList = document.getElementById('passengersList');
  const costList = document.getElementById('costList');
  const totalPaidEl = document.getElementById('totalPaid');
  const bookingMeta = document.getElementById('bookingMeta');

  // booking data stored previously:
  // - selectedFlight can be either:
  //    a) one-way: an object (flight)
  //    b) round-trip: { depart: {...}, return: {...} }
  const selected = JSON.parse(localStorage.getItem('selectedFlight')) || JSON.parse(localStorage.getItem('selectedDepartFlight')) || null;
  const passengers = JSON.parse(localStorage.getItem('passengers')) || [];
  const numPassengers = parseInt(localStorage.getItem('numPassengers')) || passengers.length || 1;
  const totalAmountStored = parseFloat(localStorage.getItem('totalAmount')) || null;
  let ticketNumbers = JSON.parse(localStorage.getItem('ticketNumbers') || 'null');

  // Booking meta
  const ref = 'SV' + Math.floor(Math.random() * 900000 + 100000); // fake ref
  bookingMeta.textContent = `Booking reference: ${ref} • Date: ${todayIso()}`;

  // Flights rendering
  flightsList.innerHTML = '';
  let baseFare = 0;

  if (!selected) {
    flightsList.innerHTML = '<li>No flight data found.</li>';
  } else if (selected.depart && selected.return) {
    // selected is round-trip object
    const d = selected.depart;
    const r = selected.return;
    flightsList.innerHTML += `<li><strong>Depart:</strong> ${d.flightNo} — ${d.from} → ${d.to} — ${d.departDate} ${d.departTime} — ${formatCurrency(d.price)} per pax</li>`;
    flightsList.innerHTML += `<li><strong>Return:</strong> ${r.flightNo} — ${r.from} → ${r.to} — ${r.departDate} ${r.departTime} — ${formatCurrency(r.price)} per pax</li>`;
    baseFare = (Number(d.price) + Number(r.price)) * numPassengers;
  } else {
    // single flight (one-way)
    const f = selected;
    flightsList.innerHTML += `<li><strong>Flight:</strong> ${f.flightNo} — ${f.from} → ${f.to} — ${f.departDate} ${f.departTime} — ${formatCurrency(f.price)} per pax</li>`;
    baseFare = Number(f.price) * numPassengers;
  }

  // Passengers
  // Ensure ticket numbers exist (one per passenger)
  function generateTicketNumber() {
    // Use common 3-digit airline prefix + 10-digit serial (pseudo)
    const prefix = '781';
    let serial = '';
    for (let i = 0; i < 10; i++) serial += Math.floor(Math.random() * 10);
    return `${prefix}-${serial}`;
  }
  if (!ticketNumbers || !Array.isArray(ticketNumbers) || ticketNumbers.length !== passengers.length) {
    ticketNumbers = passengers.map(() => generateTicketNumber());
    localStorage.setItem('ticketNumbers', JSON.stringify(ticketNumbers));
  }

  passengersList.innerHTML = '';
  if (passengers.length === 0) {
    passengersList.innerHTML = '<li>No passenger info found.</li>';
  } else {
    passengers.forEach((p, i) => {
      const tNo = ticketNumbers[i] || generateTicketNumber();
      passengersList.innerHTML += `<li><strong>Passenger ${i+1}:</strong> ${p.name} ${p.age ? '(' + p.age + ' yrs)' : ''}<br/><span class="small">Ticket No: ${tNo}</span><br/><span class="small">Email: ${p.email || 'N/A'}</span></li>`;
    });
  }

  // Add-ons and taxes
  const taxes = Math.round(baseFare * 0.12 * 100) / 100;
  const addOns = [
    { name: "Extra baggage", price: 50 * numPassengers },
    { name: "Travel insurance", price: 30 * numPassengers }
  ];
  const addOnsTotal = addOns.reduce((s, a) => s + a.price, 0);
  const computedTotal = Math.round((baseFare + taxes + addOnsTotal) * 100) / 100;

  // Cost list
  costList.innerHTML = '';
  costList.innerHTML += `<li>Base fare (x${numPassengers} pax): ${formatCurrency(baseFare)}</li>`;
  costList.innerHTML += `<li>Taxes & fees (12%): ${formatCurrency(taxes)}</li>`;
  addOns.forEach(a => costList.innerHTML += `<li>Add-on — ${a.name}: ${formatCurrency(a.price)}</li>`);

  // Prefer stored totalAmount if present (keeps parity with summary)
  const totalToShow = totalAmountStored !== null ? totalAmountStored : computedTotal;
  totalPaidEl.textContent = formatCurrency(totalToShow);

  // Save a canonical paid amount for later (optional)
  localStorage.setItem('totalAmount', totalToShow);

  // Buttons
  document.getElementById('printBtn').addEventListener('click', function() {
    window.print();
  });

  document.getElementById('doneBtn').addEventListener('click', function() {
    // simple cleanup and redirect to home
    // (do not remove localStorage if you want to keep booking data)
    window.location.href = "index.html";
  });
})();


