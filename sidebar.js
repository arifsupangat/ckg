window.addEventListener("load", async () => {
    document.getElementsByTagName("span")[0].style.backgroundColor = "red";
    document.getElementsByTagName("span")[0].style.color = "white";
    document.getElementsByClassName("div-kluster")[1].style.display = "none";
    document.getElementsByClassName("div-kluster")[2].style.display = "none";
    document.getElementsByClassName("div-kluster")[3].style.display = "none";
});

document.querySelectorAll(".span-kluster").forEach(span => {
  span.style.cursor = "pointer";
  span.addEventListener("click", () => toggleExpose(span));
});

function toggleExpose(elSpan) {
  const namaKluster = elSpan.textContent.toLowerCase();
  const divs = document.getElementsByClassName("div-kluster");
  const spans = document.getElementsByClassName("span-kluster");
  for (let n = 0; n < divs.length; n++) {
    const div = divs[n];
    const span = spans[n]
    if (div.classList.contains(namaKluster)) {
      if (window.getComputedStyle(div).getPropertyValue("display") === "none") {
        div.style.display = "block";
        elSpan.style.backgroundColor = "red";
        elSpan.style.color = "white";
      } else {
        return false; //tetap block
      }
    } else {
      div.style.display = "none";
      span.style.backgroundColor = "";
      span.style.color = "";
    }
  }
}


document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    const action = btn.getAttribute("data-action");
    const bbLahir = document.getElementById("bb-lahir").value;
    const tbLahir = document.getElementById("tb-lahir").value;
    const bbSekarang = document.getElementById("bb-sekarang").value;
    const tbSekarang = document.getElementById("tb-sekarang").value;
    const lp = document.getElementById("lingkar-perut").value;
    const gds = document.getElementById("gds").value;
    const sistole = document.getElementById("sistole").value;
    const diastole = document.getElementById("diastole").value;
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action , bbLahir: bbLahir,tbLahir: tbLahir,bbSekarang: bbSekarang,tbSekarang: tbSekarang,lp: lp,gds: gds, sistole: sistole,diastole: diastole}, (response) => {
        document.getElementById("status").textContent = response?.status || "Command sent";
      });
    });
  });
});

let isRunning = false;

document.getElementById("toggleSequence").addEventListener("click", () => {
  isRunning = !isRunning;
  if (isRunning) {
    chrome.runtime.sendMessage({ action: "start" });
    document.getElementById("toggleSequence").textContent = "Stop Autofill Individual";
    document.getElementById("status").textContent = "Running...";
  } else {
    chrome.runtime.sendMessage({ action: "stop" });
    chrome.storage.local.remove(["step", "umur"]);
    document.getElementById("toggleSequence").textContent = "Start Autofill Individual";
    document.getElementById("status").textContent = "Stopped & Reset";
  }
});


/*
//these IDs are not found
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

document.getElementById("sendWeight").addEventListener("click", () => {
  const weight = document.getElementById("weightInput").value;

  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: "setWeight", value: weight}, (response) => {
      document.getElementById("status").textContent = response?.status || "Command sent";
    });
  });
});
*/
