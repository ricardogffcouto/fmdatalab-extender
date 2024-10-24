import { addNewColumn, findPlayerTable } from './tableFunctions.js';

export function main() {
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
  } else {
    console.log("Player table not found yet");
  }
}
