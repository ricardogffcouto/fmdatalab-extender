// contentScript.js
console.log("FMDataLab Enhancer loaded");

function calculateColor(value) {
  if (value > 13.5) {
    return '#1dff21'; // Green for values > 13.5
  }

  // Gradient calculation for values between 0 and 13.5
  const minValue = 0;
  const maxValue = 13.5;
  const minColor = [255, 28, 0];  // #ff1c00 (red)
  const maxColor = [227, 255, 0]; // #e3ff00 (yellow)

  // Ensure the ratio is between 0 and 1
  const ratio = Math.max(0, Math.min(1, (value - minValue) / (maxValue - minValue)));

  // Interpolate the colors based on the ratio
  const r = Math.round(minColor[0] + ratio * (maxColor[0] - minColor[0]));
  const g = Math.round(minColor[1] + ratio * (maxColor[1] - minColor[1]));
  const b = Math.round(minColor[2] + ratio * (maxColor[2] - minColor[2]));

  // PadStart ensures the hex values are always 2 characters
  const hexR = r.toString(16).padStart(2, '0');
  const hexG = g.toString(16).padStart(2, '0');
  const hexB = b.toString(16).padStart(2, '0');

  const color = `#${hexR}${hexG}${hexB}`;
  console.log("Color:", color);
  return color;
}

function createNewCell(value) {
  const newCell = document.createElement("td");
  newCell.className = "table-cell px-4 py-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] relative bg-background";

  const color = calculateColor(value);

  const cellContent = document.createElement("div");
  cellContent.className = "flex gap-2 items-center font-normal justify-center";
  cellContent.title = value.toFixed(2);

  const innerDiv = document.createElement("div");
  innerDiv.className = "rounded-full border px-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-bold text-sm flex text-center justify-center items-center py-[6px] min-w-[60px] !leading-4";
  innerDiv.textContent = value.toFixed(2);

  // Apply dynamic color via inline styles
  innerDiv.style.color = color;  // Set the text color
  innerDiv.style.borderColor = color;  // Set the border color

  // Append the inner div to the cell content
  cellContent.appendChild(innerDiv);

  // Append the content to the new cell
  newCell.appendChild(cellContent);

  return newCell;
}

function addNewColumn(playerTable, columnName, sourceColumns, calculationFunction) {
  // Find the second tr in thead
  const headerRows = playerTable.querySelectorAll("thead tr");
  if (headerRows.length < 2) {
    console.error("Table structure is not as expected");
    return;
  }
  const headerRow = headerRows[1];

  // Add a new column header
  const newHeader = document.createElement("th");
  newHeader.className = "h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] bg-background sticky -top-[1px] z-[7] transition-colors table-head";
  newHeader.id = `col-${columnName.replace(/\s+/g, '')}`;
  newHeader.colSpan = "1";

  newHeader.innerHTML = `
    <div class="flex items-center space-x-2 justify-between min-w-[max-content]">
      <div class="flex flex-row items-center gap-1 data-[state=open]:text-foreground h-8">
        <button class="inline-flex items-center justify-center text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed relative z-[1] h-9 rounded-md data-[state=open]:text-foreground gap-1 hover:text-foreground transition-colors px-0 bg-transparent hover:bg-transparent flex-1" aria-label="Not sorted. Click to sort ascending.">
          <span class="flex-1" data-state="closed">${columnName}</span>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" aria-hidden="true">
            <path d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
          </svg>
        </button>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cursor-pointer h-4 w-4 hover:!text-foreground transition-colors !text-muted-foreground" data-state="closed">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
      </div>
      <button class="items-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed relative z-[1] hover:bg-accent hover:text-accent-foreground flex h-4 w-4 p-0 data-[state=open]:bg-muted justify-end rounded-sm" aria-label="Open Action Menu" type="button" id="radix-:rbp:" aria-haspopup="menu" aria-expanded="false" data-state="closed">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" aria-hidden="true">
          <path d="M8.625 2.5C8.625 3.12132 8.12132 3.625 7.5 3.625C6.87868 3.625 6.375 3.12132 6.375 2.5C6.375 1.87868 6.87868 1.375 7.5 1.375C8.12132 1.375 8.625 1.87868 8.625 2.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM7.5 13.625C8.12132 13.625 8.625 13.1213 8.625 12.5C8.625 11.8787 8.12132 11.375 7.5 11.375C6.87868 11.375 6.375 11.8787 6.375 12.5C6.375 13.1213 6.87868 13.625 7.5 13.625Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>
    <div class="relative z-10">
      <div class="flex space-x-2 my-2 w-full justify-between">
        <input class="flex h-10 w-full bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border shadow rounded min-w-[105px] text-xs border-primary" min="7.25" max="14.63" placeholder="Min (7.25)" type="text" value="" inputmode="numeric">
        <input class="flex h-10 w-full bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border shadow rounded min-w-[105px] text-xs border-primary" min="7.25" max="14.63" placeholder="Max (14.63)" type="text" value="" inputmode="numeric">
      </div>
    </div>
  `;

  headerRow.appendChild(newHeader);

  // Find the indices of the source columns
  const headerCells = playerTable.querySelectorAll("thead tr:last-child th");
  const columnIndices = sourceColumns.map(colId => {
    return Array.from(headerCells).findIndex(cell => cell.id === colId);
  });

  // Iterate through each row in the table body
  const bodyRows = playerTable.querySelectorAll("tbody tr");
  bodyRows.forEach((row) => {
    try {
      const cells = row.querySelectorAll("td");
      const values = columnIndices.map(index => {
        const cell = cells[index];
        if (!cell) {
          console.warn(`Cell at index ${index} not found`);
          return null;
        }
        
        // Try different methods to extract the value
        const roundedElement = cell.querySelector(".rounded-full");
        if (roundedElement) {
          return parseFloat(roundedElement.innerText);
        }
        
        // If .rounded-full is not found, try to parse the cell's text content directly
        const cellText = cell.textContent.trim();
        const parsedValue = parseFloat(cellText);
        if (!isNaN(parsedValue)) {
          return parsedValue;
        }
        
        console.warn(`Unable to extract numeric value from cell:`, cell);
        return null;
      }).filter(value => value !== null);

      // Only calculate and add new cell if we have valid values
      if (values.length > 0) {
        // Calculate the new value
        const newValue = calculationFunction(values);

        // Create a new cell and insert the calculated value
        const newCell = createNewCell(newValue);
        row.appendChild(newCell);
      } else {
        console.warn("No valid values found for this row");
      }
    } catch (error) {
      console.error("Error processing row:", error);
    }
  });
}

function findPlayerTable() {
  // Try different selectors and log what we find
  const selectors = ['table', '.table', '#playerTable', '[data-testid="player-table"]'];
  for (let selector of selectors) {
    const element = document.querySelector(selector);
    if (element) return element;
  }
  return null;
}

function main() {
  console.log("Content script main function started");
  const playerTable = findPlayerTable();
  if (playerTable) {
    console.log("Player table found, adding new column");
    const calculateAverage = (values) => values.reduce((a, b) => a + b, 0) / values.length;
    addNewColumn(
      playerTable, 
      "Physical + Mental", 
      ["col-Physical", "col-Mental"], 
      calculateAverage
    );
    console.log("New column added successfully");
  } else {
    console.log("Player table not found yet");
  }
}

// Run the main function when the content script is injected
console.log("Content script loaded");

// Use a MutationObserver to watch for changes in the DOM
const observer = new MutationObserver((mutations, obs) => {
  const playerTable = findPlayerTable();
  if (playerTable) {
    console.log("Player table found after DOM change");
    obs.disconnect(); // Stop observing
    main(); // Run our main logic
  }
});

// Start observing the document with the configured parameters
observer.observe(document, { childList: true, subtree: true });

// Also try to run main immediately in case the table is already there
main();
