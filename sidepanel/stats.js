document.getElementById('goToTodos').addEventListener('click', function() {
  window.location.href = 'index.html';
});

let totalProductive;
let totalUnproductive;

const elementProductive = document.body.querySelector('#totalProductive');
const elementUnProductive = document.body.querySelector('#totalUnproductive');
const percentProductive = document.body.querySelector('#prodPercent');
const percentUnProductive = document.body.querySelector('#unprodPercent');


window.onload=async function() {
  totalUnproductive = await readStorage('totalUnproductive');
  totalProductive = await readStorage('totalProductive');
  
  
  const totalTime = totalProductive + totalUnproductive;
  const prodValue = Math.round(10000 * (totalProductive / (totalProductive + totalUnproductive))) / 100;
  const unprodValue = Math.round(100 * (100-prodValue)) / 100;
  if (totalTime > 0 )
  {
    percentProductive.style.width = prodValue + "%";
    percentUnProductive.style.width = "100%";
  }
  else{
    percentProductive.style.width = "50%";
    percentUnProductive.style.width = "100%";
  }

  elementProductive.textContent = "Productivity: " + prodValue + "%";
  elementUnProductive.textContent = "Procrasination: " + unprodValue + "%";

}

const readStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([key], function (result) {
      if (result[key] === undefined) {
        reject();
      } else {
        resolve(result[key]);
      }
    });
  });
};
