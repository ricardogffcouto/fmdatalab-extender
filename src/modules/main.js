import { addNewColumn, findPlayerTable, updateCustomColumn } from './tableFunctions.js';

let isUpdating = false;

export function handleTableUpdate(playerTable) {
    if (isUpdating) return;
    isUpdating = true;
    console.log("Table updated, rebuilding custom column");
    setTimeout(() => {
        const calculateAverage = (values) => values.reduce((a, b) => a + b, 0) / values.length;
        addNewColumn(
            playerTable,
            "Physical + Mental",
            ["col-Physical", "col-Mental"],
            calculateAverage
        );
        isUpdating = false;
    }, 100);
}

export function main() {
  console.log("Content script main function started");
  const playerTable = findPlayerTable();
  if (playerTable) {
    handleTableUpdate(playerTable);
    playerTable.dataset.enhancerInitialized = 'true';
    console.log("New column added successfully");
  } else {
    console.log("Player table not found yet");
  }
}



