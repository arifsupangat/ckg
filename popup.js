document.addEventListener("DOMContentLoaded", () => {
  const btnAll = document.getElementById("startStop");
  const statusEl = document.getElementById("status");
  const btnMulai = document.getElementById("btnmulai");
  
	
  chrome.runtime.sendMessage({ action: "getStates" }, (response) => {	
	if(response.isRunning){
		btnAll.textContent = "Stop Autofill";
		btnMulai.selectedIndex = response.baris - 1;
	}else{
		btnAll.textContent = "Start Autofill";
		btnMulai.selectedIndex = 0;
	}
  });
	
	
  // Listen for messages from background.js
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "changeState") { //kalo udah selesai
		chrome.storage.local.get("isRunning", (result) => {
		  const isRunning = result.isRunning ?? false;
		  btnAll.textContent = isRunning
			? "Stop Autofill"
			: "Start Autofill";
		  statusEl.textContent = isRunning
			? "All Autofill Running..."
			: "All Autofill Stopped.";
		});
	  
	  // Keep sendResponse alive for async calls
		return true;
    }
  });

	// Handle btnAll button click
	btnAll.addEventListener("click", async () => {
		statusEl.textContent = "Try to " + btnAll.textContent;
		chrome.runtime.sendMessage({ action: "setState", state: btnAll.textContent.replaceAll(' ',''), baris: parseInt(btnMulai.value) } , (response) => {
			btnAll.textContent = response.status;
		});
	});
});


document.getElementById("resetAll").addEventListener("click", () => {
  chrome.storage.local.remove(["tahun", "bulan","row","subRow","pemeriksa","sex","baris","forms","isRunning"] , () => {
	  document.getElementById("status").textContent = "All cleared!";
  });
});
