const pageTitle = document.title;

chrome.runtime.sendMessage({ content: pageTitle});