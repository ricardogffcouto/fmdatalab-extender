import { findPlayerTable } from './tableFunctions.js';
import { main } from './main.js';

export function setupDOMObserver() {
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
}
