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
  elementUnProductive.textContent = "Unproductive time: " + totalUnproductive;
  totalProductive = await readStorage('totalProductive');
  elementProductive.textContent = "Productive time: " + totalProductive;
  
  percentUnProductive.style.width = 10/12 * (totalUnproductive / (totalProductive + totalUnproductive)) * 100 + "%";

  console.log(percentProductive.style.width);
  console.log(percentUnProductive.style.width);

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
