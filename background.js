chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "getStates") {
		chrome.storage.local.get(["isRunning"], (result) => {
			const isRunning = result.isRunning ?? false; // default to false if undefined 
			sendResponse({isRunning});
		});
		return true; // keep channel open for async response
	}
	
	if (message.action === "setState") {
		chrome.storage.local.get(["isRunning"], (result) => {
			//const isRunning = result.isRunning ?? false;
			switch (message.state) {
				case "StopAutofill": //dari popup.js
					chrome.storage.local.set({ isRunning: false }, () => {
						console.log("Autofill stopped.");
						sendResponse({ status: "Start Autofill"});
					});
					break;

				case "StartAutofill": //dari popup.js
					chrome.storage.local.set({ isRunning: true , baris: message.baris}, () => {
						console.log("Autofill started.");
						//send response to content.js
						chrome.runtime.sendMessage({ action: "runAutofill"});
						sendResponse({ status: "Stop Autofill"});
					});
					break;
			}
		});
		// Keep sendResponse alive for async calls
		return true;
	}
  
	if (message.action === "selesaiAll") { //https://sehatindonesiaku.kemkes.go.id/ckg-layanan
		// Set isRunning to false
		chrome.storage.local.set({ isRunning: false }, () => {
			console.log("isRunning set to false.");
			// Notify popup.js to change the start/stop button
			chrome.runtime.sendMessage({ action: "changeState"});
			// Respond back to content.js
			sendResponse({ status: "Autofill stopped." });
		});
		// Keep sendResponse alive for async calls
		return true;
	}
});
