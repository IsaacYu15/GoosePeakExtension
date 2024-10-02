import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory
} from '../node_modules/@google/generative-ai/dist/index.mjs';

// Important! Do not expose your API in your extension code. You have to
// options:
//
// 1. Let users provide their own API key.
// 2. Manage API keys in your own server and proxy all calls to the Gemini
// API through your own server, where you can implement additional security
// measures such as authentification.
//
// It is only OK to put your API key into this file if you're the only
// user of your extension or for testing.
const apiKey = '';

let genAI = null;
let model = null;
let generationConfig = {
  temperature: 1
};

const elementResponse = document.body.querySelector('#response');
const elementLoading = document.body.querySelector('#loading');
const elementError = document.body.querySelector('#error');

const elementAddToDo = document.body.querySelector('#addToDo');

let todoNodes = [];

//retrieve the old todos
chrome.storage.sync.get(['todolist'], function(result){
  
  if (!chrome.runtime.error) {
    todoNodes = result.todolist;

    if (todoNodes == undefined)
    {
      todoNodes = [];
      return;
    }

    for (let i = 0; i < todoNodes.length; i ++)
    {
      var li = document.createElement("li");
      var t = document.createTextNode(todoNodes[i]);
      li.appendChild(t);
    
      document.getElementById("toDoContents").appendChild(li);
      console.log(todoNodes[i]);
    }
  }
  else{
    console.log("could not retrieve todo nodes");
  }
  
});



function initModel(generationConfig) {
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE
    }
  ];
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    safetySettings,
    generationConfig
  });
  return model;
}

async function runPrompt(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (e) {
    console.log('Prompt failed');
    console.error(e);
    console.log('Prompt:', prompt);
    throw e;
  }
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
    getResponse(request.content);
  }
);

async function getResponse(webPageHeader)
{
  let concatToDos = "";

  for (let i = 0; i < todoNodes.length; i ++)
  {
    if (i < todoNodes.length - 1)
    {
      concatToDos += todoNodes[i] + ", ";
    }
    else{
      concatToDos += todoNodes[i] + ". ";
    }
  }

  const prompt = constructPrompt(webPageHeader, concatToDos);

  showLoading();
  try {
    const generationConfig = {
      temperature: 1
    };
    initModel(generationConfig);
    const response = await runPrompt(prompt, generationConfig);
    showResponse(response);
  } catch (e) {
    showError(e);
  }
}

function constructPrompt(pageTitle, todoList)
{
  const basePrompt = "This message is a title of a page the user is on. Based on this title, is the user currently on a web page that will help them achieve or learn things" +
                      "in their todo list? Give your repsponse as a yes or no." + 
                      `The title of the page the user is on is called: ${pageTitle} and the items on their todolist are: ${todoList}`;
  return basePrompt;
}

function showLoading() {
  hide(elementResponse);
  hide(elementError);
  show(elementLoading);
}

function showResponse(response) {

  hide(elementLoading);
  show(elementResponse);
  // Make sure to preserve line breaks in the response
  elementResponse.textContent = '';
  const paragraphs = response.split(/\r?\n/);
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    if (paragraph) {
      elementResponse.appendChild(document.createTextNode(paragraph));
    }
    // Don't add a new line after the final paragraph
    if (i < paragraphs.length - 1) {
      elementResponse.appendChild(document.createElement('BR'));
    }
  }
}

function showError(error) {
  show(elementError);
  hide(elementResponse);
  hide(elementLoading);
  elementError.textContent = error;
}

function show(element) {
  element.removeAttribute('hidden');
}

function hide(element) {
  element.setAttribute('hidden', '');
}

elementAddToDo.addEventListener('click', () => {
  var li = document.createElement("li");
  var inputValue = document.getElementById("inputToDo").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);

  if (inputValue === '') 
    return;

  document.getElementById("toDoContents").appendChild(li);
  document.getElementById("inputToDo").value = "";

  todoNodes.push(inputValue);

  chrome.storage.sync.set({ "todolist": todoNodes }, function(){
    console.log("successfully updated todos");
  });
})

