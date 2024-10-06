chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('http')) {
    pollIfUserOnTrack();
  }
});

chrome.tabs.onActivated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('http')) {
    pollIfUserOnTrack();
  }
});

function pollIfUserOnTrack ()
{
  console.log("YES");
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ['content.js']
  });
}

