// Base API URL
const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

// Select elements
const fromcurrency = document.querySelector(".from select");
const tocurrency = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount");
const button = document.querySelector("button");

// Initially hide the message
msg.innerText = "";

// Populate dropdowns with countryList
let dropdowns = document.querySelectorAll(".dropdown select");

dropdowns.forEach(select => {
    for (let code in countryList) {
        let option = document.createElement("option");
        option.value = code;
        option.innerText = code;

        // Default selection
        if (select.name === "from" && code === "USD") option.selected = true;
        if (select.name === "to" && code === "INR") option.selected = true;

        select.appendChild(option);
    }

    // Update flag when currency changes
    select.addEventListener("change", (e) => updateFlag(e.target));
});

// Update flag image
function updateFlag(element) {
    let code = element.value;
    let countryCode = countryList[code];
    let img = element.parentElement.querySelector("img");
    if (img) {
        img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    }
}

// Fetch and update conversion
async function updateExchangeRate() {
    let amtVal = parseFloat(amountInput.value);
    if (isNaN(amtVal) || amtVal < 1) {
        amtVal = 1;
        amountInput.value = "1";
    }

    const from = fromcurrency.value.toLowerCase();
    const to = tocurrency.value.toLowerCase();
    const URL = `${BASE_URL}/${from}.json`;

    try {
        const response = await fetch(URL);
        if (!response.ok) throw new Error("Failed to fetch exchange rate");

        const data = await response.json();
        const rate = data[from][to];
        const convertedAmount = (amtVal * rate).toFixed(2);

        msg.innerText = `${amtVal} ${fromcurrency.value} = ${convertedAmount} ${tocurrency.value}`;
    } catch (err) {
        console.error(err);
        msg.innerText = "Error fetching exchange rate!";
    }
}

// Button click triggers conversion
button.addEventListener("click", (e) => {
    e.preventDefault();
    updateExchangeRate();
});
