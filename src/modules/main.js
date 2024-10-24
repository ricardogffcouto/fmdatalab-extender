import { physicalMental } from '../columns/physicalMental.js';
import { addNewColumn, findPlayerTable } from './tableFunctions.js';

let isUpdating = false;

export async function handleTableUpdate(playerTable) {
    if (isUpdating) return;
    isUpdating = true;
    console.log("Table updated, rebuilding custom columns");

    const context = require.context('../columns', false, /\.js$/);
    context.keys().forEach(async (key) => {
        const module = context(key);
        console.log(`Loaded module: ${key}`, module);
        if (module.physicalMental && module.physicalMental.active) {
            console.log(`Adding column: ${module.physicalMental.name}`);
            addNewColumn(playerTable, module.physicalMental);
        }
    });

    isUpdating = false;
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



