// Published Google Sheets URL (Replace this with your published URL)
const sheetUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_dSU-EDJII8sQsSyNDXqIMOalffOH4NqMk4cGx__2IIE10rL608r4PsaB3IxyrApVxB2xXuX6gYdZ/pub?gid=0&single=true&output=csv";

// Function to fetch and display phone numbers
async function fetchPhoneNumbers() {
  try {
    const response = await fetch(sheetUrl);
    const data = await response.text();
    const phoneNumbers = parseCSV(data);
    displayPhoneNumbers(phoneNumbers);
  } catch (error) {
    console.error("Error fetching phone numbers:", error);
  }
}

// Function to parse CSV data into an array of phone numbers
function parseCSV(csvData) {
  const rows = csvData.split("\n");
  const phoneNumbers = rows.map((row) => row.split(",")[0]); // Assuming phone numbers are in the first column
  return phoneNumbers;
}

// Function to display phone numbers in the HTML
function displayPhoneNumbers(phoneNumbers) {
  const phoneNumbersContainer = document.getElementById("phone-numbers");

  // Clear the container first
  phoneNumbersContainer.innerHTML = "";

  // Loop through phone numbers and display them
  phoneNumbers.forEach((phone) => {
    if (phone.trim()) {
      // Check if phone number is not empty
      const phoneNumberElement = document.createElement("div");
      phoneNumberElement.className = "phone-number";
      phoneNumberElement.textContent = phone;
      phoneNumbersContainer.appendChild(phoneNumberElement);
    }
  });
}

// Fetch phone numbers on page load
fetchPhoneNumbers();
