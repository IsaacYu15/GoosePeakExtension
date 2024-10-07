document.getElementById('goToTodos').addEventListener('click', function() {
  window.location.href = 'index.html';
});

let totalProductive;
let totalUnproductive;

const elementProductive = document.body.querySelector('#totalProductive');
const elementUnProductive = document.body.querySelector('#totalUnproductive');

chrome.storage.sync.get(['totalUnproductive'], function(result){
  
  if (!chrome.runtime.error) {
    totalUnproductive = Number(result.totalUnproductive);

    if (totalUnproductive == undefined || isNaN(totalUnproductive))
    {
      totalUnproductive = 0;
    }

    elementUnProductive.textContent = "Unproductive time: " + totalUnproductive;
  }
  
});

chrome.storage.sync.get(['totalProductive'], function(result){
  
  if (!chrome.runtime.error) {
    totalProductive = Number(result.totalProductive);

    if (totalProductive == undefined || isNaN(totalProductive))
    {
      totalProductive = 0;
    }
  }

  elementProductive.textContent = "Productive time: " + totalProductive;
  
});