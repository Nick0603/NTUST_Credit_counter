// var app = chrome.runtime.getBackgroundPage();

function addLibrary(){
  chrome.tabs.executeScript(null, {file: "jquery/jquery-2.1.4.js"});
  chrome.tabs.executeScript(null, {file: "bootstrap/js/bootstrap.min.js"});
  chrome.tabs.insertCSS(null, {file: "bootstrap/css/bootstrap.min.css"});
  chrome.tabs.insertCSS(null, {file: "bootstrap/css/bootstrap-theme.min.css"});
}


var checkDownLoadArray = [];
function downLoadData(saveKey,url){
  $.ajax({
    url,url,
    type:"GET",
    dataType:"text",
    success:function(data){

      chrome.tabs.executeScript(null, {code: " courses['" + saveKey +"'] = " + data +";"});
      checkDownLoadArray.push( jQuery.parseJSON(data) );
      if(checkDownLoadArray.length == 3){
        chrome.tabs.executeScript(null, {file: "changeView.js"});
        chrome.tabs.insertCSS(null, {file: "content.css"});
        chrome.tabs.executeScript(null, {file: "content.js"});  
      }
    },
    error:function(e){
      console.warn(e);
      alert("Error!!");
    }
  })
}


function start() {
  addLibrary();
  var English = document.querySelector("select[name='English']").value;
  var common = document.querySelector("select[name='common']").value;
  var major = document.querySelector("select[name='major']").value;
  chrome.tabs.executeScript(null, {code: " var courses = [];"});
  downLoadData("English","C:/Users/Nick.DESKTOP-JTUE9U6/Desktop/course_data/" + English  + ".json");
  downLoadData("common","C:/Users/Nick.DESKTOP-JTUE9U6/Desktop/course_data/"  +  common + ".json");
  downLoadData("major","C:/Users/Nick.DESKTOP-JTUE9U6/Desktop/course_data/major/" + major + ".json");
}


  document.getElementById('submit').addEventListener('click', start);

