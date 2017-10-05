chrome.runtime.sendMessage({method: "getLocalStorage", key: "hidesearch"}, function(response) {
	if (response.data === "true" && window.location.href.indexOf("/wiki/") > -1) {
			document.getElementById("searchform").style.display = "none";
			document.getElementById("p-search").style.marginRight = "0";
	}
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getLocalStorage")
      sendResponse({data: localStorage[request.key]});
    else
      sendResponse({}); // snub them.
});