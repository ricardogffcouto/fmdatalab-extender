import { setupDOMObserver } from './modules/domObserver.js';
import { main } from './modules/main.js';

console.log("FMDataLab Enhancer loaded - v1.1 - 12");

// Run the main function when the content script is injected
console.log("Content script loaded");

// Set up the DOM observer
setupDOMObserver();

// Also try to run main immediately in case the table is already there
main();
