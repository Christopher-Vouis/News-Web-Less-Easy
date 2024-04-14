const newsWebEasyURL = 'https://www3.nhk.or.jp/news/easy/';

chrome.webNavigation.onCompleted.addListener(function(details) {
  if (details.url.includes(newsWebEasyURL)) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "initialize" });
    });
  }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	if(message.buttonClicked){
		console.log("recieved");
	}
});
