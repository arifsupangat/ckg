const fileInput = document.getElementById('file-input');
const fileContent = document.getElementById('file-content');
let dataPeserta = "";

document.addEventListener("DOMContentLoaded", () => {
  const btnAll = document.getElementById("startStop");
  const statusEl = document.getElementById("status");
  const btnMulai = document.getElementById("btnmulai");
	
  chrome.runtime.sendMessage({ action: "getStates" }, (response) => {	
	if(response.isRunning){
		btnAll.textContent = "Stop Autofill";
	}else{
		btnAll.textContent = "Start Autofill";
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
		chrome.runtime.sendMessage({ action: "setState", state: btnAll.textContent.replaceAll(' ','') } , (response) => {
			btnAll.textContent = response.status;
		});
	});
});


document.getElementById("resetAll").addEventListener("click", () => {
  chrome.storage.local.remove(["tahun", "bulan","row","subRow","pemeriksa","isRunning"] , () => {
	  document.getElementById("status").textContent = "All cleared!";
  });
});

fileInput.addEventListener('change', (event) => {
  // 2. Get the selected file from the FileList object
  const file = event.target.files[0]; 
  
  if (!file) {
    return; // Exit if no file was chosen (e.g., user canceled)
  }
  
  if (!file.name.endsWith('.js')) {
	fileContent.textContent = "Error: Please select a valid .js file.";
	return;
}

  // 3. Instantiate the FileReader API
  const reader = new FileReader();

  // 4. Define what happens when the file is successfully read
  reader.onload = (e) => {
    const text = e.target.result; // The file text content
    fileContent.textContent = text;
	//dataPeserta = JSON.parse(textContent);
  };

  // 5. Define an error handler just in case
  reader.onerror = (err) => {
    console.error('Error reading file:', err);
  };

  // 6. Trigger the read operation (reads the file as plain text)
  reader.readAsText(file);
});
