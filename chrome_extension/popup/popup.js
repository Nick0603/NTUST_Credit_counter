// var app = chrome.runtime.getBackgroundPage();

function addLibrary(){
  chrome.tabs.executeScript(null, {file: "jquery/jquery-2.1.4.js"});
  chrome.tabs.executeScript(null, {file: "bootstrap/js/bootstrap.min.js"});
  chrome.tabs.insertCSS(null, {file: "bootstrap/css/bootstrap.min.css"});
  chrome.tabs.insertCSS(null, {file: "bootstrap/css/bootstrap-theme.min.css"});
}

function addCourseData(common,English,major){
  chrome.tabs.executeScript(null, {code: " var courses = {};"});
  chrome.tabs.executeScript(null, {file: "course_data/" + common + ".json"});
  chrome.tabs.executeScript(null, {file: "course_data/" + English + ".json"});
  chrome.tabs.executeScript(null, {file: "course_data/major/" + major + ".json"});
}

function start() {
  addLibrary();
  var English = document.querySelector("select[name='English']").value;
  var common = document.querySelector("select[name='common']").value;
  var major = document.querySelector("select[name='major']").value;
  addCourseData(English,common,major);
  chrome.tabs.executeScript(null, {file: "changeView.js"});
  chrome.tabs.insertCSS(null, {file: "content.css"});
  chrome.tabs.executeScript(null, {file: "content.js"});   
}


  document.getElementById('submit').addEventListener('click', start);

