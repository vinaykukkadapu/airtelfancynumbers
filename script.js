// Path to the locally stored Excel file in the repository
const excelFilePath = 'https://raw.githubusercontent.com/vinaykukkadapu/airtelfancynumbers/main/Book1.xlsx';

let jsonData = []; // To store data globally for sorting

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
    data[0].forEach((header, index) => {
      const th = document.createElement('th');
      th.textContent = header;
      th.addEventListener('click', () => sortTableByColumn(index)); // Add click event for sorting
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

// Function to sort table by a specific column
function sortTableByColumn(columnIndex) {
  const isAscending = document.querySelector(`#excel-data thead th:nth-child(${columnIndex + 1})`).classList.contains('asc'); // Check current sort direction
  const sortedData = jsonData.slice(1).sort((a, b) => {
    const cellA = a[columnIndex] ? a[columnIndex].toString().toLowerCase() : '';
    const cellB = b[columnIndex] ? b[columnIndex].toString().toLowerCase() : '';
    
    if (cellA < cellB) return isAscending ? -1 : 1;
    if (cellA > cellB) return isAscending ? 1 : -1;
    return 0;
  });

  // Toggle sort direction
  const thElements = document.querySelectorAll('#excel-data thead th');
  thElements.forEach(th => th.classList.remove('asc', 'desc')); // Clear all sort states

  const targetTh = document.querySelector(`#excel-data thead th:nth-child(${columnIndex + 1})`);
  if (isAscending) {
    targetTh.classList.remove('asc');
    targetTh.classList.add('desc');
  } else {
    targetTh.classList.remove('desc');
    targetTh.classList.add('asc');
  }

  // Display sorted data
  displayExcelData([jsonData[0], ...sortedData]);
}
