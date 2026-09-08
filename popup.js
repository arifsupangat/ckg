document.getElementById("resetStep").addEventListener("click", () => {
  chrome.storage.local.remove("step", () => {
    document.getElementById("status").textContent = "Step cleared!";
  });
});

document.getElementById("resetUmur").addEventListener("click", () => {
  chrome.storage.local.remove("umur", () => {
    document.getElementById("status").textContent = "Umur cleared!";
  });
});

document.getElementById("resetAll").addEventListener("click", () => {
  chrome.storage.local.remove(["step", "umur"], () => {
    document.getElementById("status").textContent = "All cleared!";
  });
});

function sendCommand(action) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action}, (response) => {
      document.getElementById("status").textContent = response?.status || "Command sent";
    });
  });
}

document.getElementById("doStepA").addEventListener("click", () => sendCommand("stepA"));
document.getElementById("doStepB").addEventListener("click", () => sendCommand("stepB"));
document.getElementById("doStepC").addEventListener("click", () => sendCommand("stepC"));


/*
function setStep(n) {
  chrome.storage.local.set({ step: n });
}

function getStep() {
  return new Promise(resolve => {
    chrome.storage.local.get(["step"], result => {
      resolve(parseInt(result.step || "0", 10));
    });
  });
}

function setUmur(val) {
  chrome.storage.local.set({ umur: val });
}

function getUmur() {
  return new Promise(resolve => {
    chrome.storage.local.get(["umur"], result => {
      resolve(parseInt(result.umur || "0", 10));
    });
  });
}
*/