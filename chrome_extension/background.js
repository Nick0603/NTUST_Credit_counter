chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(null, {file: "jquery/jquery-2.1.4.js"});
    chrome.tabs.executeScript(null, {file: "bootstrap/js/bootstrap.min.js"});
    chrome.tabs.insertCSS(null, {file: "bootstrap/css/bootstrap.min.css"});
    chrome.tabs.insertCSS(null, {file: "bootstrap/css/bootstrap-theme.min.css"});

    chrome.tabs.executeScript(null, {code: " var courses = {};"});
    chrome.tabs.executeScript(null, {file: "course_data/English103.json"});
    chrome.tabs.executeScript(null, {file: "course_data/common103.json"});
    chrome.tabs.executeScript(null, {file: "course_data/ME103.json"});


    chrome.tabs.executeScript(null, {file: "content.js"});
});

