import { calculateColor } from './colorCalculator.js';
import { columnHeaderTemplate } from './htmlTemplates.js';

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

export function addCellValue(row, columnIndices, calculationFunction, targetColumnIndex) {
    try {
      const cells = row.querySelectorAll("td");
      const values = columnIndices.map(index => {
        const cell = cells[index];
        if (!cell) {
          console.warn(`Cell at index ${index} not found`);
          return null;
        }
        return extractNumericValue(cell);
      }).filter(value => value !== null);
  
      if (values.length > 0) {
        const newValue = calculationFunction(values);
        let cell;
  
        if (targetColumnIndex !== undefined && targetColumnIndex < row.cells.length) {
          cell = row.cells[targetColumnIndex];
          updateCell(cell, newValue);
        } else {
          cell = createNewCell(newValue);
          row.appendChild(cell);
        }
      } else {
        console.warn("No valid values found for this row");
      }
    } catch (error) {
      console.error("Error processing row:", error);
    }
  }

export function addNewColumn(playerTable, column) {
    console.log("Column to add:", column);
    const { name, sourceColumns, calculationFunction } = column;
    const columnName = name;
  // Find the second tr in thead
  const headerRows = playerTable.querySelectorAll("thead tr");
  if (headerRows.length < 2) {
    console.error("Table structure is not as expected");
    return;
  }
  const headerRow = headerRows[1];

  // Check if the column already exists
  const existingHeader = headerRow.querySelector(`th[id="col-${columnName.replace(/\s+/g, '')}"]`);
  let columnIndex;

  if (existingHeader) {
    console.log("Column already exists, updating values");
    columnIndex = Array.from(headerRow.children).indexOf(existingHeader);
  } else {
    // Add a new column header
    const newHeader = document.createElement("th");
    newHeader.className = "h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] bg-background sticky -top-[1px] z-[7] transition-colors table-head";
    newHeader.id = `col-${columnName.replace(/\s+/g, '')}`;
    newHeader.colSpan = "1";
    newHeader.innerHTML = columnHeaderTemplate(columnName);
    headerRow.appendChild(newHeader);
    columnIndex = headerRow.children.length - 1;
  }

  // Find the indices of the source columns
  const headerCells = playerTable.querySelectorAll("thead tr:last-child th");
  const sourceColumnIndices = sourceColumns.map(colId => {
    return Array.from(headerCells).findIndex(cell => cell.id === colId);
  });

  // Iterate through each row in the table body
  const bodyRows = playerTable.querySelectorAll("tbody tr");
  bodyRows.forEach((row) => {
    if (existingHeader) {
      // Remove existing cell if updating
      if (row.cells[columnIndex]) {
        row.deleteCell(columnIndex);
      }
    }
    addCellValue(row, sourceColumnIndices, calculationFunction, columnIndex);
  });
}

export function findPlayerTable() {
  const selectors = ['table', '.table', '#playerTable', '[data-testid="player-table"]'];
  for (let selector of selectors) {
    const element = document.querySelector(selector);
    if (element) return element;
  }
  return null;
}

function extractNumericValue(cell) {
  const roundedElement = cell.querySelector(".rounded-full");
  if (roundedElement) {
    return parseFloat(roundedElement.innerText);
  }
  
  const cellText = cell.textContent.trim();
  const parsedValue = parseFloat(cellText);
  if (!isNaN(parsedValue)) {
    return parsedValue;
  }
  
  console.warn(`Unable to extract numeric value from cell:`, cell);
  return null;
}

function updateCell(cell, value) {
  const color = calculateColor(value);
  let innerDiv = cell.querySelector('div > div');
  
  if (!innerDiv) {
    const cellContent = document.createElement("div");
    cellContent.className = "flex gap-2 items-center font-normal justify-center";
    cellContent.title = value.toFixed(2);

    innerDiv = document.createElement("div");
    innerDiv.className = "rounded-full border px-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-bold text-sm flex text-center justify-center items-center py-[6px] min-w-[60px] !leading-4";
    
    cellContent.appendChild(innerDiv);
    cell.innerHTML = '';
    cell.appendChild(cellContent);
  }

  innerDiv.textContent = value.toFixed(2);
  innerDiv.style.color = color;
  innerDiv.style.borderColor = color;
  cell.title = value.toFixed(2);
}

// Ensure that the createNewCell and updateCell functions are exported
export { createNewCell, updateCell };
