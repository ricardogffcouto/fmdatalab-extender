import { findPlayerTable } from './tableFunctions.js';
import { main, handleTableUpdate } from './main.js';

export function setupDOMObserver() {
  let observer = null;

  function observeTableChanges(playerTable) {
    const tableBody = playerTable.querySelector('tbody');
    
    if (tableBody) {
      if (observer) observer.disconnect();

      observer = new MutationObserver((mutations, obs) => {
        if (mutations.some(mutation => !mutation.target.classList.contains('Physical + Mental'))) {
          console.log("Detected changes in the table content");
          obs.disconnect();  // Temporarily disconnect the observer
          handleTableUpdate(playerTable).then(() => {
            obs.observe(tableBody, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeFilter: ['class']
            });
          });
        }
      });

      observer.observe(tableBody, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });
    }
  }

  function attachEventListenersToTable(playerTable) {
    const headers = playerTable.querySelectorAll('thead th');
    headers.forEach(header => {
      header.addEventListener('click', () => {
        console.log("Sorting triggered");
        handleTableUpdate(playerTable);  // Trigger table update after sorting
      });
    });

    const filters = playerTable.querySelectorAll('input, select');
    filters.forEach(filter => {
      filter.addEventListener('change', () => {
        console.log("Filtering triggered");
        handleTableUpdate(playerTable);  // Trigger table update after filtering
      });
    });
  }

  function initTableObserver() {
    const playerTableContainer = document.getElementById('player-table');
    
    // Check if the container exists before observing
    if (playerTableContainer) {
      const playerTable = findPlayerTable();
      if (playerTable) {
        if (!playerTable.dataset.enhancerInitialized) {
          console.log("Player table found after DOM change");
          main();  // Run the main logic and initialize the table
          playerTable.dataset.enhancerInitialized = true;  // Mark as initialized
          observeTableChanges(playerTable);  // Start observing table updates
          attachEventListenersToTable(playerTable);  // Attach event listeners for sorting/filtering
        } else {
          handleTableUpdate(playerTable);  // Handle the table updates
        }
      }
    } else {
      // Retry observing if the container does not exist yet
      console.log("Player table container not found. Retrying...");
      setTimeout(initTableObserver, 1000);  // Retry after 1s
    }
  }

  initTableObserver();  // Start the observation process
}
