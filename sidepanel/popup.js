import data from "./data.js";

const urlParams = new URLSearchParams(window.location.search);
var count = decodeURIComponent(urlParams.get('data'));

const headerElement = document.querySelector('#headerText');
headerElement.textContent = data[count].header;

const descElement = document.querySelector('#desc');
descElement.textContent = data[count].desc;