// Path to the locally stored Excel file in the repository
const excelFilePath = 'https://raw.githubusercontent.com/vinaykukkadapu/airtelfancynumbers/main/Book1.xlsx';

let jsonData = []; // To store data globally

// Fetch the Excel file and read its content
fetch(excelFilePath)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error fetching the Excel file: ${response.statusText}`);
    }
    return response.arrayBuffer(); // Read the file as a binary ArrayBuffer
  })
  .then(data => {
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0]; // Get the first sheet
    const worksheet = workbook.Sheets[firstSheetName]; // Get the worksheet

    jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Convert the sheet to JSON
    displayExcelData(jsonData); // Display the data in a table
  })
  .catch(error => console.error('Error reading Excel file:', error));

// Function to display Excel data in a table
function displayExcelData(data) {
  const tableHead = document.querySelector('#excel-data thead tr');
  const tableBody = document.querySelector('#excel-data tbody');

  // Clear any existing table content
  tableHead.innerHTML = '';
  tableBody.innerHTML = '';

  // Populate table header (first row of Excel file)
  if (data.length > 0) {
    data[0].forEach((header) => {
      const th = document.createElement('th');
      th.textContent = header;
      tableHead.appendChild(th);
    });

    // Populate table body (remaining rows)
    data.slice(1).forEach(row => {
      const tr = document.createElement('tr');
      row.forEach(cell => {
        const td = document.createElement('td');
        td.textContent = cell || ''; // Display cell content or empty string if undefined
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    });
  } else {
    console.log("No data available in the Excel file.");
  }
}

// Function to filter table by price
function filterByPrice() {
  const filterValue = document.getElementById('price-filter').value; // Get selected filter value
  const priceColumnIndex = 3; // Assuming price is in the second column (index 1)

  if (filterValue) {
    const sortedData = jsonData.slice(1).sort((a, b) => {
      const cellA = a[priceColumnIndex] ? Number(a[priceColumnIndex]) : 0;
      const cellB = b[priceColumnIndex] ? Number(b[priceColumnIndex]) : 0;

      return filterValue === 'asc' ? cellA - cellB : cellB - cellA; // Sort based on the selected filter
    });

    // Display sorted data
    displayExcelData([jsonData[0], ...sortedData]);
  } else {
    // If no filter is selected, display the original data
    displayExcelData(jsonData);
  }
}
