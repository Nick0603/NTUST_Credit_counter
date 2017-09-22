
const courseDataUrl = "https://nick0603.github.io/NTUST_Credit_counter_CourseTestData/";
const mainFileUrl = "https://nick0603.github.io/NTUST_Credit_counter_main/";

function makeCourseDataFunc(saveKey,url){
  return function(callback){
    $.ajax({
      url,url,
      type:"GET",
      dataType:"text",
      success:function(data){
        chrome.tabs.executeScript(null, {code: " courses['" + saveKey +"'] = " + data +";"});
        callback(data);
      },
      error:function(e){
        console.warn(e);
        alert("Error: Can't include courseData!");
      }
    })
  }
}

function getFile(fileName,callback){
  $.ajax({
    url: mainFileUrl + fileName ,
    type:"GET",
    dataType:"text",
    success:function(code){
      callback(code);
    },
    error:function(e){
      console.warn(e);
      alert("Error: Can't include mainFile!");
    }
  })
}

function start() {
  chrome.tabs.executeScript(null, {code: " var courses = [];"});
  chrome.tabs.executeScript(null, {file: "jquery/jquery-2.1.4.js"});
  chrome.tabs.executeScript(null, {file: "bootstrap/js/bootstrap.min.js"});
  chrome.tabs.insertCSS(null, {file: "bootstrap/css/bootstrap.min.css"});
  chrome.tabs.insertCSS(null, {file: "bootstrap/css/bootstrap-theme.min.css"});
  var English = $("select[name='English']").val();
  var common = $("select[name='common']").val();
  var major = $("select[name='major']").val();
  var getEnglishData = makeCourseDataFunc("English",courseDataUrl + English  + ".json");
  var getCommonData = makeCourseDataFunc("common",courseDataUrl  +  common + ".json");
  var getMajorData = makeCourseDataFunc("major",courseDataUrl + "/major/" + major + ".json");
  getEnglishData(function(){
    getCommonData(function(){
      getMajorData(function(){
        getFile("changeView.js",function(gotCode){
          chrome.tabs.executeScript(null, {code:gotCode});
          getFile("content.css",function(gotCode){
            chrome.tabs.insertCSS(null, {code:gotCode});
            getFile("content.js",function(gotCode){
              chrome.tabs.executeScript(null,{code:gotCode});
            })
          })
        })
      })
    })
  })
}

function getLocalVersion(callback){
  $.get(chrome.extension.getURL('manifest.json'), function(info){
    callback(info);
  },'json');
}

function getLatestVersion(localInfo,callback){
  $.get("https://nick0603.github.io/NTUST_Credit_counter_CourseTestData/manifest.json", function(info){
    var localVersion = localInfo.version;
    var latestVersion = info.version;
    callback(localVersion,latestVersion)
  },'json');
}

function checkVersion(localVersion,latestVersion){
  if( localVersion == latestVersion){
    $("#submit").click(start);
  }else{
    chrome.tabs.executeScript(null, {file: "sweetalert2/sweetalert2.min.js"});
    chrome.tabs.insertCSS(null, {file: "sweetalert2/sweetalert2.min.css"});
    getFile("update.js",function(gotCode){
      chrome.tabs.executeScript(null, {code: gotCode});
    })
  }
}



getLocalVersion(function(info){
  getLatestVersion(info,function(localVersion,latestVersion){
    checkVersion(localVersion,latestVersion)
  })
})

