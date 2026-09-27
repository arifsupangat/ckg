// === Helpers ===
function getElementByXpath(xpath) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

async function waitForElm(xpath) {
  return new Promise(resolve => {
    const check = () => {
      const el = getElementByXpath(xpath);
      if (el) {
        resolve(el);
        return true;
      }
      return false;
    };
    if (check()) return;

    const observer = new MutationObserver(() => {
      if (check()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

async function waitForXPathWithRetry(xpath, maxAttempts = 5, delayMs = 500) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const el = await waitForElm();
    if (el) return el;

    // if not found, wait before next attempt
    await new Promise(r => setTimeout(r, delayMs));
  }
  return null; // give up after maxAttempts
}

const forceInput = (el, val) => {
    const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
    ).set;
    setter.call(el, String(val));

    ["input", "change", "blur", "keyup"].forEach((e) =>
        el.dispatchEvent(new Event(e, { bubbles: true }))
    );
};

// === Helper: wait for element ===
async function waitForElmMulai() {
  const barisMulai = await getBaris();
  return new Promise(resolve => {
	const check = () => {
		const container = document.querySelector("div.table-individu-terdaftar");
		const btn = container?.querySelectorAll('button')[barisMulai-1];
		if (btn) {
			resolve(btn);
			return true;
		}
		return false;
    };
    if (check()) return;

    const observer = new MutationObserver(() => {
      if (check()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
}


// === Retry wrapper ===
async function getBtnMulaiWithRetry(maxAttempts = 5, delayMs = 500) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const btn = await waitForElmMulai();
    if (btn) return btn;

    // if not found, wait before next attempt
    await new Promise(r => setTimeout(r, delayMs));
  }
  return null; // give up after maxAttempts
}

async function getElemWithRetry(path, maxAttempts = 5, delayMs = 500) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const elm = await waitForElm(path);
    if (elm) return elm;
	console.log("attempt : ",attempt);
    // if not found, wait before next attempt
    await new Promise(r => setTimeout(r, delayMs));
  }
  return null; // give up after maxAttempts
}

async function waitForElementBack() {
    return new Promise(resolve => {
        const check = () => {
            const container = document.querySelector("w-full mb-25");
            const img = container?.querySelector('img');
            if (img) {
                resolve(img);
                return true;
            }
            return false;
        };
        if (check()) return;

        const observer = new MutationObserver(() => {
            if (check()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
}

async function getTitleWithRetry(maxAttempts = 10, delayMs = 500){
	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const namaForm = await waitForTitle();
    if (namaForm) return namaForm;

    // if not found, wait before next attempt
    await new Promise(r => setTimeout(r, delayMs));
  }
  return null; // give up after maxAttempts
}

async function waitForTitle() {
    return new Promise(resolve => {
        const check = () => {
            const namaForm = document.getElementsByClassName("sd-title")[0].getAttribute("aria-label");
            if (namaForm) {
                resolve(namaForm);
                return true;
            }
            return false;
        };
        if (check()) return;

        const observer = new MutationObserver(() => {
            if (check()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// === Shared Helpers ===
function setBaris(n) {
  chrome.storage.local.set({ baris: n });
}
function getBaris() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["baris"], (result) => {
      resolve(parseInt(result.baris || "0", 10));
    });
  });
}

function setTahun(n) {
  chrome.storage.local.set({ tahun: n });
}
function getTahun() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["tahun"], (result) => {
      resolve(parseInt(result.tahun || "0", 10));
    });
  });
}

function setRow(n) {
  chrome.storage.local.set({ row: n });
}
function getRow() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["row"], (result) => {
      resolve(parseInt(result.row || "0", 10));
    });
  });
}

function setForms(forms) {
  chrome.storage.local.set({ forms: forms });
}
function getForms() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["forms"], (result) => {
      resolve(result.forms);
    });
  });
}

function setBulan(n) {
  chrome.storage.local.set({ bulan: n });
}
function getBulan() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["bulan"], (result) => {
      resolve(parseInt(result.bulan || "0", 10));
    });
  });
}

function setJK(sex) {
  chrome.storage.local.set({ sex: sex });
}
function getJK(){
	return new Promise((resolve) => {
		chrome.storage.local.get(["sex"], (result) => {
		  resolve(result.sex);
		});
	});
}

function setPemeriksa(operator) {
  chrome.storage.local.set({ pemeriksa: operator });
}
function getPemeriksa() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["pemeriksa"], (result) => {
      resolve(result.pemeriksa);
    });
  });
}

// ====== Fill functions ==========
async function disabilitas() {
    getElementByXpath("//input[@value=\"PPV00000561\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function demografiDewasaPerempuan(){
    var umurWanita = await getTahun();
	if(umurWanita > 30){
		getElementByXpath("//input[@value=\"PPV00000338\"]")?.click();  // menikah
	}else{
		//value="PPV00000337" name="LPM000063|FRM000007|PPM00000172|text_sq_100"
		getElementByXpath("//input[@value=\"PPV00000337\"]")?.click();  //belum menikah
		await delay(200); //muncul rencana menikah dalam setahun ini
		//value="PPV00000344" name="LPM000063|FRM000007|PPM00000174|text_sq_101"
		getElementByXpath("//input[@value=\"PPV00000344\"]")?.click(); //tidak ada rencana menikah dalam setahun
	}
    //value="PPV00000342" name="LPM000063|FRM000007|PPM00000173|text_sq_102" Apakah sedang hamil? tidak
    getElementByXpath("//input[@value=\"PPV00000342\"]")?.click();
    //value="PPV00000561" name="LPM000063|FRM000007|PPM00000299|text_sq_103"
    getElementByXpath("//input[@value=\"PPV00000561\"]")?.click(); //nondisabilitas btw sama dengan yg nondisabilitas anak PPV00000561
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function demografiDewasaLaki(){
    var umurPria = await getTahun();
	if(umurPria > 33){
		getElementByXpath("//input[@value=\"PPV00000338\"]")?.click();  // menikah
	}else{
		//value="PPV00000337" name="LPM000063|FRM000007|PPM00000172|text_sq_100"
		getElementByXpath("//input[@value=\"PPV00000337\"]")?.click();  //belum menikah
		await delay(200); //muncul rencana menikah dalam setahun ini
		//value="PPV00000344" name="LPM000063|FRM000007|PPM00000174|text_sq_101"
		getElementByXpath("//input[@value=\"PPV00000344\"]")?.click(); //tidak ada rencana menikah dalam setahun
	}
    //value="PPV00000561" name="LPM000056|FRM000006|PPM00000299|text_sq_102"
    getElementByXpath("//input[@value=\"PPV00000561\"]")?.click(); //nondisabilitas btw sama dengan yg nondisabilitas anak PPV00000561
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function demografiLansia(){
    //value="PPV00000338" name="LPM000064|FRM000008|PPM00000172|text_sq_100"
    getElementByXpath("//input[@value=\"PPV00000338\"]")?.click();  //menikah
    //value="PPV00000561" name="LPM000064|FRM000008|PPM00000299|text_sq_101"
    getElementByXpath("//input[@value=\"PPV00000561\"]")?.click(); //nondisabilitas btw sama dengan yg nondisabilitas anak PPV00000561
    await delay(300);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function imunisasiRutin() {
	//value="PPV00000932" name="PPM00000508_sq_100" 
	//value="PPV00000934" name="PPM00000509_sq_101"
	//value="PPV00000928" name="PPM00000506_sq_102"
	getElementByXpath("//input[@value=\"PPV00000932\"]")?.click();
	await delay(300);
	getElementByXpath("//input[@value=\"PPV00000934\"]")?.click();
	await delay(300);
	getElementByXpath("//input[@value=\"PPV00000928\"]")?.click();
	getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]//div[@title='Sudah']")?.click();
    await delay(100);
	//value="PPV00000938" name="PPM00000511_sq_104"
	getElementByXpath("//input[@value=\"PPV00000938\"]")?.click();
	//value="PPV00000948" name="PPM00000513_sq_105"
	getElementByXpath("//input[@value=\"PPV00000948\"]")?.click();
	//value="PPV00000950" name="PPM00000514_sq_106"
	getElementByXpath("//input[@value=\"PPV00000950\"]")?.click();
	//value="PPV00000972" name="PPM00000525_sq_107"
	getElementByXpath("//input[@value=\"PPV00000972\"]")?.click();
	//value="PPV00000976" name="PPM00000527_sq_108"
	getElementByXpath("//input[@value=\"PPV00000976\"]")?.click();
	//value="PPV00000952" name="PPM00000515_sq_109"
	getElementByXpath("//input[@value=\"PPV00000952\"]")?.click();
	//value="PPV00000954" name="PPM00000516_sq_110"
	getElementByXpath("//input[@value=\"PPV00000954\"]")?.click();
	//value="PPV00000974" name="PPM00000526_sq_111"
	getElementByXpath("//input[@value=\"PPV00000974\"]")?.click();
	//value="PPV00000978" name="PPM00000528_sq_112"
	getElementByXpath("//input[@value=\"PPV00000978\"]")?.click();
	//value="PPV00000956" name="PPM00000517_sq_113"
	getElementByXpath("//input[@value=\"PPV00000956\"]")?.click();
	//value="PPV00000960" name="PPM00000519_sq_114"
	getElementByXpath("//input[@value=\"PPV00000960\"]")?.click();
	//value="PPV00000980" name="PPM00000529_sq_115"
	getElementByXpath("//input[@value=\"PPV00000980\"]")?.click();
	//value="PPV00000962" name="PPM00000520_sq_116"
	getElementByXpath("//input[@value=\"PPV00000962\"]")?.click();
	//value="PPV00000964" name="PPM00000521_sq_117"
	getElementByXpath("//input[@value=\"PPV00000964\"]")?.click();
	//value="PPV00000968" name="PPM00000523_sq_118"
	getElementByXpath("//input[@value=\"PPV00000968\"]")?.click();
	//value="PPV00000970" name="PPM00000524_sq_119"
	getElementByXpath("//input[@value=\"PPV00000970\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function imunisasiRutinSekolah() {
	//value="PPV00001306" name="PPM00000763_sq_100"
	//value="PPV00001308" name="PPM00000764_sq_101"
	//value="PPV00000614" name="PPM00000335_sq_102"
	getElementByXpath("//input[@value=\"PPV00001306\"]")?.click();
	await delay(300);
	getElementByXpath("//input[@value=\"PPV00001308\"]")?.click();
	await delay(300);
	getElementByXpath("//input[@value=\"PPV00000614\"]")?.click();
	//value="PPV00000630" name="PPM00000346_sq_103"
	getElementByXpath("//input[@value=\"PPV00000630\"]")?.click();
	//value="PPV00000636" name="PPM00000351_sq_104"
	getElementByXpath("//input[@value=\"PPV00000636\"]")?.click();
	//value="PPV00000647" name="PPM00000356_sq_105"
	getElementByXpath("//input[@value=\"PPV00000647\"]")?.click();
	//value="PPV00000658" name="PPM00000364_sq_106"
	getElementByXpath("//input[@value=\"PPV00000658\"]")?.click();
	//value="PPV00000667" name="PPM00000369_sq_107"
	getElementByXpath("//input[@value=\"PPV00000667\"]")?.click();
    await delay(300);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function diabetes() {
    getElementByXpath("//input[@value='PPV00001035']")?.click();
    await delay(1000); //ada muncul pertanyaan selanjutnya
    getElementByXpath("//input[@value='PPV00000483']")?.click();
    getElementByXpath("//input[@value='PPV00000485']")?.click();
    getElementByXpath("//input[@value='PPV00000491']")?.click();
    getElementByXpath("//input[@value='PPV00000493']")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function risikoMalaria() {
    //value="PPV00000581" name="LPM000081|FRM000115|PPM00000314|text_sq_100"
    //value="PPV00000591" name="LPM000081|FRM000115|PPM00000320|text_sq_101"
    //value="PPV00000607" name="LPM000081|FRM000115|PPM00000330|text_sq_102"
    //value="PPV00001233" name="LPM000081|FRM000115|PPM00000690|text_sq_103"
    getElementByXpath("//input[@value=\"PPV00000581\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000591\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000607\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00001233\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function risikoTBdewasaLansia() {
    //value="PPV00000883" name="LPM000131|FRM000180|PPM00000477|text_sq_100"
    getElementByXpath("//input[@value=\"PPV00000883\"]")?.click(); //tidak batuk
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function risikoKankerUsus() {
    //value="PPV00000348" checked="" name="LPM000060|FRM000027|PPM00000175|text_sq_100"
    //value="PPV00000538" checked="" name="LPM000060|FRM000027|PPM00000288|text_sq_101"
    getElementByXpath("//input[@value='PPV00000348']")?.click();
    getElementByXpath("//input[@value='PPV00000538']")?.click();
	//value="PPV00000507" name="PPM00000254_sq_102" < 50
	//value="PPV00000508" name="PPM00000254_sq_102" 50-69
	//value="PPV00000509" name="PPM00000254_sq_102" > 70
	const umurLansia = await getTahun();
	if(umurLansia < 50){
		getElementByXpath("//input[@value='PPV00000507']")?.click();
	}else{
		if(umurLansia > 69){
			getElementByXpath("//input[@value='PPV00000509']")?.click();
		}else{
			getElementByXpath("//input[@value='PPV00000508']")?.click();
		}
	}
	//value="PPV00000510" name="PPM00000255_sq_103" Laki-Laki
	//value="PPV00000511" name="PPM00000255_sq_103" Perempuan
	const gender = await getJK();
	if(gender === "perempuan"){
		getElementByXpath("//input[@value='PPV00000511']")?.click();
	}else{
		getElementByXpath("//input[@value='PPV00000510']")?.click();
	}
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function kankerParu() {
    //value="PPV00001025" checked="" name="LPM000105|FRM000138|PPM00000561|text_sq_100"
    //value="PPV00001027" checked="" name="LPM000105|FRM000138|PPM00000562|text_sq_101"
    //value="PPV00001029" checked="" name="LPM000105|FRM000138|PPM00000563|text_sq_102"
    //value="PPV00000737" checked="" name="LPM000105|FRM000138|PPM00000402|text_sq_103"
    //value="PPV00001031" checked="" name="LPM000105|FRM000138|PPM00000564|text_sq_104"
    //value="PPV00001033" checked="" name="LPM000105|FRM000138|PPM00000565|text_sq_105"
    getElementByXpath("//input[@value=\"PPV00001025\"]")?.click();
	await delay(200);
    getElementByXpath("//input[@value=\"PPV00001027\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00001029\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000737\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00001031\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00001033\"]")?.click();
	await delay(500);
	getElementByXpath("//input[@value='Kirim']")?.click();
}

async function kankerParu45() {
    //value="PPV00000539" name="PPM00000289_sq_100" Laki-laki
	//value="PPV00000540" name="PPM00000289_sq_100" Perempuan
	const gender = await getJK();
	if(gender === "perempuan"){
		getElementByXpath("//input[@value='PPV00000540']")?.click();
	}else{
		getElementByXpath("//input[@value='PPV00000539']")?.click();
	}
	//value="PPV00000541" name="PPM00000290_sq_101" > 65
	//value="PPV00000542" name="PPM00000290_sq_101" 45 - 65
	//value="PPV00000543" name="PPM00000290_sq_101" < 45
	const umurLansia = await getTahun();
	if(umurLansia < 45){
		getElementByXpath("//input[@value='PPV00000543']")?.click();
	}else{
		if(umurLansia > 65){
			getElementByXpath("//input[@value='PPV00000541']")?.click();
		}else{
			getElementByXpath("//input[@value='PPV00000542']")?.click();
		}
	}
	//value="PPV00000021" name="LPM000028|FRM000041|PPM00000017|text_sq_100"
    //value="PPV00000033" name="LPM000028|FRM000041|PPM00000028|text_sq_101"
    //value="PPV00000547" name="LPM000028|FRM000041|PPM00000291|text_sq_102"
    //value="PPV00000050" name="LPM000028|FRM000041|PPM00000041|text_sq_103"
    //value="PPV00000064" name="LPM000028|FRM000041|PPM00000050|text_sq_104"
    //value="PPV00000069" name="LPM000028|FRM000041|PPM00000055|text_sq_105"
    //value="PPV00000076" name="LPM000028|FRM000041|PPM00000057|text_sq_106"
    //value="PPV00000127" name="LPM000028|FRM000041|PPM00000084|text_sq_107"
    getElementByXpath("//input[@value=\"PPV00000021\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000033\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000547\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000050\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000064\"]")?.click();
	getElementByXpath("//input[@value=\"PPV00000069\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000076\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000127\"]")?.click();
	await delay(300);
	getElementByXpath("//input[@value='Kirim']")?.click();
}

async function risikoKankerLeherRahim() {
    //value="PPV00000346" name="LPM000062|FRM000088|PPM00000171|text_sq_100"
    getElementByXpath("//input[@value=\"PPV00000346\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function imt() {
    const umurAnak = await getTahun();
	let bbAnak = "15";
	let tbAnak = "116";
	switch(umurAnak){
		case 5 :
		case 6 :
			bbAnak = "17";
			tbAnak = "117";
			break;
		case 7 :
		case 8 :
		case 9 :
			bbAnak = "22";
			tbAnak = "121";
			break;
		default :
			bbAnak = "30";
			tbAnak = "130";
			break;
	}
	forceInput(document.getElementById("sq_100i"), bbAnak); 
    await new Promise((r) => setTimeout(r, 500));
    forceInput(document.getElementById("sq_101i"), tbAnak); 
    await new Promise((r) => setTimeout(r, 500));
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function tbbb() {
    const umurBalita = await getTahun();
	const bbBalita = umurBalita + 10;
    const tbBalita = 65 + ((bbBalita - 10) * 10);
	forceInput(document.getElementById("sq_100i"), bbBalita); 
    await new Promise((r) => setTimeout(r, 230));
    forceInput(document.getElementById("sq_101i"), tbBalita); 
    await new Promise((r) => setTimeout(r, 340));
	//value="PPV00001242" name="PPM00000696_sq_102"
	getElementByXpath("//input[@value=\"PPV00001242\"]")?.click();
	//value="PPV00000199" name="PPM00000110_sq_103"
	getElementByXpath("//input[@value=\"PPV00000199\"]")?.click();
    await delay(300);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function imtDewasaPerempuan() {
    forceInput(document.getElementById("sq_100i"), "55"); 
    await new Promise((r) => setTimeout(r, 500));
    forceInput(document.getElementById("sq_101i"), "155"); 
    await new Promise((r) => setTimeout(r, 600));
    forceInput(document.getElementById("sq_102i"), "75"); 
    await new Promise((r) => setTimeout(r, 550));
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function imtDewasaLaki() {
    forceInput(document.getElementById("sq_100i"), "61"); 
    await new Promise((r) => setTimeout(r, 500));
    forceInput(document.getElementById("sq_101i"), "165"); 
    await new Promise((r) => setTimeout(r, 600));
    forceInput(document.getElementById("sq_102i"), "77"); 
    await new Promise((r) => setTimeout(r, 550));
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function keswa() {
    //value="PPV00000381" name="LPM000023|FRM000067|PPM00000192|text_sq_100"
    //value="PPV00000382" name="LPM000023|FRM000067|PPM00000193|text_sq_101"
    //value="PPV00000383" name="LPM000023|FRM000067|PPM00000194|text_sq_102"
    //value="PPV00000384" name="LPM000023|FRM000067|PPM00000195|text_sq_103"
    getElementByXpath("//input[@value=\"PPV00000381\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000382\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000383\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000384\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function gejalaCemas() {
    //value="PPV00000593" name="LPM000104|FRM000112|PPM00000321|text_sq_100"
    //value="PPV00000599" name="LPM000104|FRM000112|PPM00000325|text_sq_101"
    //value="PPV00000605" name="LPM000104|FRM000112|PPM00000329|text_sq_102"
    getElementByXpath("//input[@value=\"PPV00000593\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000599\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000605\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function gejalaCemasAnak() {
    //value="PPV00000577" name="PPM00000312_sq_100"
    //value="PPV00000583" name="PPM00000315_sq_101"
    //value="PPV00000587" name="PPM00000317_sq_102"
    getElementByXpath("//input[@value=\"PPV00000577\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000583\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000587\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function gejalaDepresi() {
    //value="PPV00000627" name="LPM000104|FRM000125|PPM00000343|text_sq_100"
    //value="PPV00000629" name="LPM000104|FRM000125|PPM00000345|text_sq_101"
    //value="PPV00000633" name="LPM000104|FRM000125|PPM00000347|text_sq_102"
    getElementByXpath("//input[@value=\"PPV00000627\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000629\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000633\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function gejalaDepresiAnak() {
    //value="PPV00000619" name="PPM00000337_sq_100"
    //value="PPV00000621" name="PPM00000339_sq_101"
    //value="PPV00000625" name="PPM00000342_sq_102"
    getElementByXpath("//input[@value=\"PPV00000619\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000621\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000625\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function reproduksiPutra() {
    //value="PPV00000589" name="LPM000088|FRM000126|PPM00000318|text_sq_100"
    //value="PPV00000595" name="LPM000088|FRM000126|PPM00000322|text_sq_101"
    //value="PPV00000603" name="LPM000088|FRM000126|PPM00000327|text_sq_102"
    getElementByXpath("//input[@value=\"PPV00000589\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000595\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000603\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function reproduksiPutri() {
    //value="PPV00000564" name="LPM000089|FRM000123|PPM00000304|text_sq_100" ya menstruasi
    //value="PPV00000566" name="LPM000089|FRM000123|PPM00000305|text_sq_101"
    //value="PPV00000566" name="LPM000089|FRM000123|PPM00000305|text_sq_101"
    //value="PPV00000571" name="LPM000089|FRM000123|PPM00000307|text_sq_103"
    getElementByXpath("//input[@value=\"PPV00000564\"]")?.click();
    await delay(300);
    getElementByXpath("//input[@value=\"PPV00000566\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000569\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000571\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function merokok() {
    //value="PPV00000365" checked="" name="LPM000057|FRM000064|PPM00000183|text_sq_100"
    //value="PPV00000426" checked="" name="LPM000057|FRM000064|PPM00000185|text_sq_104"
    //value="PPV00000439" checked="" name="LPM000057|FRM000064|PPM00000218|text_sq_107"
    getElementByXpath("//input[@value=\"PPV00000365\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value=\"PPV00000426\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000439\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function merokokSekolah() {
    //value="PPV00000365" name="LPM000085|FRM000118|PPM00000183|text_sq_100"
    //value="PPV00000439" name="LPM000085|FRM000118|PPM00000218|text_sq_104"
    getElementByXpath("//input[@value=\"PPV00000365\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000439\"]")?.click();
    await delay(300);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function aktivitas() {
    //value="PPV00001257" name="PPM00000706_sq_100"
	getElementByXpath("//input[@value='PPV00001257']")?.click();
	await delay(250);
    forceInput(document.getElementById("sq_101i"), "7"); 
    await new Promise((r) => setTimeout(r, 350));
	forceInput(document.getElementById("sq_102i"), "45"); 
    await new Promise((r) => setTimeout(r, 250));
    //value="PPV00001259" name="PPM00000709_sq_103"
	getElementByXpath("//input[@value='PPV00001259']")?.click();
	await delay(250);
    forceInput(document.getElementById("sq_104i"), "7"); 
    await new Promise((r) => setTimeout(r, 350));
	forceInput(document.getElementById("sq_105i"), "45"); 
    await new Promise((r) => setTimeout(r, 250));
	//value="PPV00001261" name="PPM00000712_sq_106"
	getElementByXpath("//input[@value='PPV00001261']")?.click();
	await delay(250);
    forceInput(document.getElementById("sq_107i"), "7"); 
    await new Promise((r) => setTimeout(r, 350));
	forceInput(document.getElementById("sq_108i"), "45"); 
    await new Promise((r) => setTimeout(r, 250));
	//value="PPV00001263" name="PPM00000715_sq_109"
	getElementByXpath("//input[@value='PPV00001263']")?.click();
	await delay(250);
    forceInput(document.getElementById("sq_110i"), "7"); 
    await new Promise((r) => setTimeout(r, 350));
	forceInput(document.getElementById("sq_111i"), "45"); 
    await new Promise((r) => setTimeout(r, 250));
	//value="PPV00001265" name="PPM00000718_sq_112"
	getElementByXpath("//input[@value='PPV00001265']")?.click();
	await delay(250);
    forceInput(document.getElementById("sq_113i"), "7"); 
    await new Promise((r) => setTimeout(r, 350));
	forceInput(document.getElementById("sq_114i"), "45"); 
    await new Promise((r) => setTimeout(r, 250));
	//value="PPV00001267" name="PPM00000721_sq_115"
	getElementByXpath("//input[@value='PPV00001267']")?.click();
	await delay(250);
    forceInput(document.getElementById("sq_116i"), "7"); 
    await new Promise((r) => setTimeout(r, 350));
	forceInput(document.getElementById("sq_117i"), "45"); 
    await new Promise((r) => setTimeout(r, 250));
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function aktivitasRemaja() {
    forceInput(document.getElementById("sq_100i"), "7"); 
    await new Promise((r) => setTimeout(r, 500));
    forceInput(document.getElementById("sq_101i"), "7"); 
    await new Promise((r) => setTimeout(r, 600));
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function kebugaran() {
    //value="PPV00000609" name="LPM000079|FRM000113|PPM00000328|text_sq_100"
    //value="PPV00000639" name="LPM000079|FRM000113|PPM00000352|text_sq_101"
    //value="PPV00000644" name="LPM000079|FRM000113|PPM00000354|text_sq_102"
    //value="PPV00000650" name="LPM000079|FRM000113|PPM00000357|text_sq_103"
    getElementByXpath("//input[@value=\"PPV00000609\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000639\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000644\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000650\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function kebugaranJasmani() {
    //value="PPV00000707" name="PPM00000392_sq_100"
	getElementByXpath("//input[@value=\"PPV00000707\"]")?.click();
    await delay(300);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function tensiAnakRemaja() {
    forceInput(document.getElementById("sq_100i"), "120"); 
    await new Promise((r) => setTimeout(r, 500));
    forceInput(document.getElementById("sq_101i"), "80"); 
    await new Promise((r) => setTimeout(r, 600));
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function telingamata12() {
    //value="PPV00001078" name="PPM00000591_sq_100"
	//value="PPV00001074" name="PPM00000589_sq_101"
	getElementByXpath("//input[@value=\"PPV00001078\"]")?.click();
	getElementByXpath("//input[@value=\"PPV00001074\"]")?.click();
	await delay(100);
	getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]//div[@title='Sesuai Umur']")?.click();
	//value="PPV00001080" name="PPM00000592_sq_103"
	//value="PPV00000109" name="PPM00000078_sq_104"
	getElementByXpath("//input[@value=\"PPV00001080\"]")?.click();
	getElementByXpath("//input[@value=\"PPV00000109\"]")?.click();
    await delay(300);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function telingamata3456() {
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]//div[@title='Sesuai Umur']")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]//div[@title='Daya lihat anak baik (visus >6/12 atau >6/60)']")?.click();
    await delay(100);
	//value="PPV00001078" name="PPM00000591_sq_102"
	getElementByXpath("//input[@value=\"PPV00001078\"]")?.click();
	//value="PPV00001074" name="PPM00000589_sq_103"
	getElementByXpath("//input[@value=\"PPV00001074\"]")?.click();
	//value="PPV00001080" name="PPM00000592_sq_104"
	getElementByXpath("//input[@value=\"PPV00001080\"]")?.click();
    await delay(200);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function telingaMataSekolah() {
    //value="PPV00000572" name="LPM000098|FRM000137|PPM00000308|text_sq_100"
    //value="PPV00000752" name="LPM000098|FRM000137|PPM00000412|text_sq_101"
    //value="PPV00000695" name="LPM000098|FRM000137|PPM00000324|text_sq_102"
    //value="PPV00000754" name="LPM000098|FRM000137|PPM00000413|text_sq_103"
    //value="PPV00000705" name="LPM000098|FRM000137|PPM00000349|text_sq_104"
    //value="PPV00000756" name="LPM000098|FRM000137|PPM00000414|text_sq_105"
    //value="PPV00000677" name="LPM000098|FRM000137|PPM00000379|text_sq_106"
    //value="PPV00000760" name="LPM000098|FRM000137|PPM00000416|text_sq_107"
    //value="PPV00000683" name="LPM000098|FRM000137|PPM00000371|text_sq_108"
    //value="PPV00000758" name="LPM000098|FRM000137|PPM00000415|text_sq_109"
    //value="PPV00000687" name="LPM000098|FRM000137|PPM00000384|text_sq_110"
    getElementByXpath("//input[@value=\"PPV00000572\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000752\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000695\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000754\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000705\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000756\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000677\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000760\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000683\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000758\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000687\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function mataTelinga1839() {
    //value="PPV00001020" name="LPM000031|FRM000042|PPM00000559|text_sq_100" serumen
    getElementByXpath("//input[@value=\"PPV00001020\"]")?.click();
	//value="PPV00001022" name="PPM00000560_sq_101" infeksi
	getElementByXpath("//input[@value=\"PPV00001022\"]")?.click();
	//value="PPV00000022" name="PPM00000020_sq_102" pendengaran normal
	getElementByXpath("//input[@value=\"PPV00000022\"]")?.click();
	//value="PPV00000044" name="PPM00000040_sq_104" visus normal
	getElementByXpath("//input[@value=\"PPV00000044\"]")?.click();
    await delay(200);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function mataTelinga40() {
    //value="PPV00001020" name="LPM000054|FRM000099|PPM00000559|text_sq_100"
    getElementByXpath("//input[@value=\"PPV00001020\"]")?.click();
	//value="PPV00001022" name="PPM00000560_sq_101" infeksi
	getElementByXpath("//input[@value=\"PPV00001022\"]")?.click();
	//value="PPV00000022" name="PPM00000020_sq_102" pendengaran normal
	getElementByXpath("//input[@value=\"PPV00000022\"]")?.click();
	//value="PPV00000044" name="PPM00000040_sq_104" visus normal
	getElementByXpath("//input[@value=\"PPV00000044\"]")?.click();
	//value="PPV00000099" name="PPM00000072_sq_109" pupil normal
	getElementByXpath("//input[@value=\"PPV00000099\"]")?.click();
    await delay(300);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function gds() {
    getElementByXpath("//input[@value='PPV00001035']")?.click();
    forceInput(document.getElementById("sq_102i"), "98"); 
    await new Promise((r) => setTimeout(r, 1500));
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function gdsDewasaLansia() {
    //value="PPV00000328" checked="" name="LPM000072|FRM000256|PPM00000160|text_sq_100"
    getElementByXpath("//input[@value='PPV00000328']")?.click();
	await delay(150);
    forceInput(document.getElementById("sq_102i"), "132"); 
    await new Promise((r) => setTimeout(r, 1500));
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function tensiDewasaLansia() {
    //value="PPV00000380" checked="" name="LPM000072|FRM000265|PPM00000203|text_sq_100"
    getElementByXpath("//input[@value='PPV00000380']")?.click();
    forceInput(document.getElementById("sq_102i"), "131"); 
    await new Promise((r) => setTimeout(r, 250));
    forceInput(document.getElementById("sq_103i"), "84"); 
    await new Promise((r) => setTimeout(r, 150));
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function gilut() {
    getElementByXpath("//input[@value='PPV00000712']")?.click(); // tidak ada karies
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function gilutDewasa() {
    //value="PPV00000027" name="LPM000033|FRM000055|PPM00000025|text_sq_100"
    //value="PPV00000039" name="LPM000033|FRM000055|PPM00000035|text_sq_101"
    getElementByXpath("//input[@value='PPV00000027']")?.click(); // tidak ada karies
    getElementByXpath("//input[@value='PPV00000039']")?.click();
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function periodontal() {
    //value="PPV00000066" name="LPM000032|FRM000056|PPM00000044|text_sq_100"
    //value="PPV00000095" name="LPM000032|FRM000056|PPM00000070|text_sq_101"
    getElementByXpath("//input[@value='PPV00000066']")?.click();
        getElementByXpath("//input[@value='PPV00000095']")?.click();
        await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function tb() {
    //value="PPV00001238" name="LPM000129|FRM000175|PPM00000693|text_sq_100"
    getElementByXpath("//input[@value='PPV00001238']")?.click();
    //value="PPV00000874" name="LPM000129|FRM000175|PPM00000467|text_sq_101"
    getElementByXpath("//input[@value='PPV00000874']")?.click();
    //value="PPV00000876" name="LPM000129|FRM000175|PPM00000468|text_sq_102"
    getElementByXpath("//input[@value='PPV00000876']")?.click();
    //value="PPV00000878" name="LPM000129|FRM000175|PPM00000469|text_sq_103"
    getElementByXpath("//input[@value='PPV00000878']")?.click();
    //value="PPV00000880" name="LPM000129|FRM000175|PPM00000470|text_sq_104"
    getElementByXpath("//input[@value='PPV00000880']")?.click();
    //value="PPV00000900" name="LPM000129|FRM000175|PPM00000495|text_sq_105"
    getElementByXpath("//input[@value='PPV00000900']")?.click();
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function tbDewasaLansia() {
    //value="PPV00001241" name="LPM000133|FRM000182|PPM00000694|text_sq_100"
    //value="PPV00000885" name="LPM000133|FRM000182|PPM00000480|text_sq_101"
    //value="PPV00000887" name="LPM000133|FRM000182|PPM00000481|text_sq_102"
    //value="PPV00000889" name="LPM000133|FRM000182|PPM00000482|text_sq_103
    //value="PPV00000891" name="LPM000133|FRM000182|PPM00000483|text_sq_104"
    //value="PPV00000900" name="LPM000133|FRM000182|PPM00000495|text_sq_105"
    getElementByXpath("//input[@value=\"PPV00001241\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000885\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000887\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000889\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000891\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000900\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
}

async function epidTB() {
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]//div[@title='Tidak ada']")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]//div[@title='Tidak dilakukan']")?.click();
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function frambusia() {
    getElementByXpath("//input[@value='PPV00001303']")?.click();
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function kusta() {
    //value="PPV00001302" name="PPM00000585_sq_100"
	getElementByXpath("//input[@value='PPV00001302']")?.click();
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function skabies() {
    //value="PPV00001301" name="PPM00000593_sq_100"
	getElementByXpath("//input[@value='PPV00001301']")?.click();
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function imunisasiHepatitis() {
    getElementByXpath("//input[@value=\"PPV00001304\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function hepatitisSD(){
	//value="PPV00000350" name="PPM00000176_sq_100"
	//value="PPV00000352" name="PPM00000177_sq_101"
	//value="PPV00000356" name="PPM00000179_sq_102"
	//value="PPV00000358" name="PPM00000180_sq_103"
	getElementByXpath("//input[@value=\"PPV00000350\"]")?.click();
	getElementByXpath("//input[@value=\"PPV00000352\"]")?.click();
	getElementByXpath("//input[@value=\"PPV00000356\"]")?.click();
	getElementByXpath("//input[@value=\"PPV00000358\"]")?.click();
    await delay(300);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function hepatitisSMPSMA() {
    //value="PPV00000350" name="LPM000096|FRM000122|PPM00000176|text_sq_100"
    //value="PPV00000352" name="LPM000096|FRM000122|PPM00000177|text_sq_101"
    //value="PPV00000354" name="LPM000096|FRM000122|PPM00000178|text_sq_102"
    //value="PPV00000356" name="LPM000096|FRM000122|PPM00000179|text_sq_103"
    //value="PPV00000358" name="LPM000096|FRM000122|PPM00000180|text_sq_104"
    //value="PPV00000360" name="LPM000096|FRM000122|PPM00000181|text_sq_105"
    //value="PPV00000362" name="LPM000096|FRM000122|PPM00000182|text_sq_106"
    //value="PPV00000449" name="LPM000096|FRM000122|PPM00000221|text_sq_107"
    getElementByXpath("//input[@value=\"PPV00000350\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000352\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000354\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000356\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000358\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000360\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000362\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000449\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function hati() {
    //value="PPV00000350" name="LPM000061|FRM000028|PPM00000176|text_sq_100"
    //value="PPV00000352" name="LPM000061|FRM000028|PPM00000177|text_sq_101"
    //value="PPV00000354" name="LPM000061|FRM000028|PPM00000178|text_sq_102"
    //value="PPV00000356" name="LPM000061|FRM000028|PPM00000179|text_sq_103"
    //value="PPV00000358" name="LPM000061|FRM000028|PPM00000180|text_sq_104"
    //value="PPV00000360" name="LPM000061|FRM000028|PPM00000181|text_sq_105"
    //value="PPV00000362" name="LPM000061|FRM000028|PPM00000182|text_sq_106"
    //value="PPV00000449" name="LPM000061|FRM000028|PPM00000221|text_sq_107"
    //value="PPV00000463" name="LPM000061|FRM000028|PPM00000230|text_sq_108"
    getElementByXpath("//input[@value=\"PPV00000350\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000352\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000354\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000356\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000358\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000360\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000362\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000449\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000463\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function bbLahirSekarang() {
    const bulan = await getBulan();
	let bbBayi = 4000 + (bulan * 250);
	
	forceInput(document.getElementById("sq_100i"), 3500); 
    await new Promise((r) => setTimeout(r, 150));
    await delay(1000);
    forceInput(document.getElementById("sq_101i"), bbBayi); 
    await new Promise((r) => setTimeout(r, 150));
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function jantungBawaan() {
    forceInput(document.getElementById("sq_100i"), "97"); 
    await new Promise((r) => setTimeout(r, 150));
    await delay(1000);
    forceInput(document.getElementById("sq_101i"), "98"); 
    await new Promise((r) => setTimeout(r, 150));
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function kulitTinja() {
    getElementByXpath("//input[@value=\"PPV00000040\"]")?.click();
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}

async function tetanus(){
	//value="PPV00000924" name="PPM00000505_sq_100"
	getElementByXpath("//input[@value=\"PPV00000924\"]")?.click();
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
}
// ========== Main Variables ============
const arrayNamaForms = ["Demografi Anak","Demografi Dewasa Perempuan","Demografi Dewasa Laki-Laki","Demografi Lansia",
                          "Faktor Risiko Gula Darah Anak","Pemeriksaan Gula Darah Anak","Pemeriksaan Gula Darah Dewasa Lansia",
                          "Faktor Risiko TB - Dewasa & Lansia","Faktor Risiko TB - Mandiri","Faktor Risiko dan Skrining X-Ray TB (Anak 1-9 tahun)","Faktor Risiko dan Skrining X-Ray TB (Dewasa & Lansia)","Pemeriksaan Tuberkulosis (Anak)","Pemeriksaan Tuberkulosis (Dewasa & Lansia)",
                          "Berat Lahir","Skrining Pertumbuhan - Balita dan Anak Prasekolah 1-5 Tahun","Gizi Anak IMT/U","Gizi (BB - TB - Lingkar Perut) Perempuan","Gizi (BB - TB - Lingkar Perut) Laki-laki",
                          "Gejala Cemas Anak","Gejala Depresi Anak","Gejala Cemas Remaja","Gejala Depresi Remaja","Kesehatan Jiwa","Kesehatan Jiwa Dewasa",
                          "Perilaku Merokok - Anak Sekolah","Perilaku Merokok","Hasil Perilaku Merokok","Penapisan Risiko Kanker Paru","Skrining Kanker Paru (Usia =>45 thn)",
                          "Hasil Pemeriksaan Kebugaran Jasmani Anak","Kuesioner Tingkat Aktivitas Fisik - Tingkat Aktivitas Fisik","Kelayakan Tes Kebugaran","Tingkat Aktivitas Fisik (sedang dan berat)","Tingkat Aktivitas Fisik",
                          "Skrining Telinga dan Mata (1-2 tahun)","Skrining Telinga dan Mata - Balita dan Anak Prasekolah","Skrining Telinga dan Mata - Anak Sekolah","Skrining Telinga dan Mata (18-39 tahun)","Skrining Telinga dan Mata (=>40 tahun)",
                          "Pemeriksaan Gigi - Anak","Skrining Karies dan Gigi Hilang","Skrining Penyakit Periodontal",
                          "Faktor Risiko Hati","Hati","Faktor Risiko Hepatitis SD","Faktor Risiko Hepatitis SMP dan SMA","Riwayat Imunisasi Hepatitis B","Riwayat Imunisasi Rutin Balita","Riwayat Imunisasi Rutin Anak Sekolah","Riwayat Imunisasi Tetanus(Status T) - Hanya untuk Catin",
                          "Pemeriksaan Penyakit Frambusia (untuk daerah endemis atau berisiko frambusia)","Pemeriksaan Penyakit Kusta","Pemeriksaan Penyakit Skabies",
                          "Pemeriksaan Jantung Bawaan","Tekanan Darah Anak dan Remaja","Tekanan Darah Dewasa Lansia",
                          "Kesehatan Reproduksi Putra - Anak Sekolah","Kesehatan Reproduksi Putri - Anak Sekolah","Kanker Leher Rahim",
                          "Faktor Risiko Malaria","Faktor Risiko Kanker Usus","Edukasi Warna Kulit dan Tinja Bayi"
                        ];
const arrayFungsiForm = [disabilitas,demografiDewasaPerempuan,demografiDewasaLaki,demografiLansia,
                          diabetes,gds,gdsDewasaLansia,
                          risikoTBdewasaLansia,risikoTBdewasaLansia,tb,tbDewasaLansia,epidTB,epidTB,
                          bbLahirSekarang,tbbb,imt,imtDewasaPerempuan,imtDewasaLaki,
                          gejalaCemasAnak,gejalaDepresiAnak,gejalaCemas,gejalaDepresi,keswa,keswa,
                          merokokSekolah,merokok,merokok,kankerParu,kankerParu45,
                          kebugaranJasmani,aktivitasRemaja,kebugaran,aktivitas,aktivitas,
                          telingamata12,telingamata3456,telingaMataSekolah,mataTelinga1839,mataTelinga40,
                          gilut,gilutDewasa,periodontal,
                          hati,hati,hepatitisSD,hepatitisSMPSMA,imunisasiHepatitis,imunisasiRutin,imunisasiRutinSekolah,tetanus,
                          frambusia,kusta,skabies,
                          jantungBawaan,tensiAnakRemaja,tensiDewasaLansia,
                          reproduksiPutra,reproduksiPutri,risikoKankerLeherRahim,
                          risikoMalaria,risikoKankerUsus,kulitTinja
                        ];
// ========== Main Auto =============
function clickInputData(arrayForms){
	const removedElement = arrayForms.pop();
	const divs = document.querySelectorAll('#tableLayanan .col-span-2');
	const target = Array.from(divs).find(el => el.textContent.trim() === removedElement);
	if (target) {
	  const row = target.parentElement;
	  const inputDataBtn = row.querySelector('button');
	  if (inputDataBtn) {
		setForms(JSON.stringify(arrayForms))
		inputDataBtn.click();
	  }
	}
}

async function getLayananState() { //buat fungsi autoFIllAllIndividual
	await delay(1000);
	const mulai = getElementByXpath(".//button[normalize-space(.)='Mulai Pemeriksaan']");
	const sedang = getElementByXpath("//div[@class='tracking-wide' and normalize-space(text())='Selesaikan Layanan']");
	if(mulai){
		getElementByXpath("//div[@class='tracking-wide' and normalize-space(text())='Mulai Pemeriksaan']")?.click();
		await delay(500); //muncul popup Simpan tanggal pelayanan
		getElementByXpath("//div[@class='tracking-wide' and normalize-space(text())='Simpan']")?.click();
		manageDetailPemeriksaan();
	}else{
		if(sedang){
			console.log("sedang pemeriksaan ke autofill individual");
			manageDetailPemeriksaan();
		}else{ //"Selesai Pemeriksaan"
			console.log("selesai pemeriksaan ke halaman depan pelayanan");
			await delay(500);
			const imgBack = await getElemWithRetry("//img[@src='/images/icons/icon-arrow-left.svg']");
			if(imgBack){
				imgBack.click(); //reload ke /https://sehatindonesiaku.kemkes.go.id/ckg-pelayanan
			}else{
				console.log("can't find the back.");
			} 
		}
	}
}

async function fillForm(){
	//lihat caption atasnya
	await delay(500);
	let namaForm = await getTitleWithRetry();
	if(namaForm === "Gizi Anak Sekolah"){
		namaForm = "Gizi Anak IMT/U";
	}else{
		if(namaForm === null || namaForm === undefined){
			location.reload();
		}
	}
	arrayFungsiForm[arrayNamaForms.indexOf(namaForm)]();
}

async function awalMulaiDetailPemeriksaan(){
	const btnMulai = await getBtnMulaiWithRetry();
	if (btnMulai) {
		btnMulai.click();
		await delay(200);
		console.log("scanning detail pemeriksaan ....");
		await delay(200);
		getLayananState();
	} else {
		//berarti gak ada list lagi
		//set isRunningAll to false
		chrome.runtime.sendMessage({ action: "selesaiAll" }, (response) => {
			console.log(response);
		});
	}
}

async function finishingDetailPemeriksaan(){
	getElementByXpath("//div[@class='tracking-wide' and normalize-space(text())='Selesaikan Layanan']")?.click();
	await delay(500);
	getElementByXpath("//div[@class='tracking-wide' and normalize-space(text())='Konfirmasi']")?.click();
	chrome.storage.local.remove(["tahun", "bulan","row","forms","pemeriksa"]);
	await delay(500);
	const imgBack = await getElemWithRetry("//img[@src='/images/icons/icon-arrow-left.svg']");
	if(imgBack){
		imgBack.click(); //reload ke /https://sehatindonesiaku.kemkes.go.id/ckg-pelayanan
		awalMulaiDetailPemeriksaan();
	}else{
		console.log("can't find the back.");
	} 
}

async function manageDetailPemeriksaan(){
	const tahun = await getTahun();
	if(tahun === undefined){ //berarti belum di set
		const divUmur = getElementByXpath("//div[contains(., 'Umur Saat Pemeriksaan')]/following-sibling::div[1]");
		const usia = divUmur.textContent;
		const usiaInt = parseInt(usia.substring(0,usia.indexOf(" Tahun")));
		setTahun(usiaInt);
		const bulanInt = parseInt(usia.substring((usia.indexOf("Tahun") + 5),usia.indexOf(" Bulan")));
		setBulan(bulanInt);
	}
	
	const jk = await getJK();
	if(jk === undefined){
		const divJK = getElementByXpath("//div[contains(., 'Jenis Kelamin')]/following-sibling::div[1]");
		setJK(divJK.textContent);
	}

	const pemeriksa = await getPemeriksa();
	let operator = "mandiri";
	if(pemeriksa !== undefined){
		operator = pemeriksa;
	}else{
		setPemeriksa("mandiri"); //mulai dari awal
	}

	const row = await getRow();
	let barisMandiri = 0;
	if(row !== undefined){
		setRow(0);
	}else{
		barisMandiri = row;
	}
	//looping
	console.log("mulai looping .....");
	console.log(operator);
	await delay(100);
	switch(operator){
		case "mandiri" :
			//scanning pemeriksaan mandiri loop for(tbody[0].rows[n].length) ; n mulai dari get chrome.storage.local(rowPemeriksaan); kalo belum di set berarti mulai dari 0;
			const tbodyMandiri = await waitForXPathWithRetry("//tbody");
			if(tbodyMandiri){ //not null / undefined
				const jmlBaris = document.evaluate(
									"count(//tbody/tr)",
									document.querySelector("table"),
								   null,
								  XPathResult.ANY_TYPE,
								  null,
								  );
								  
				
				while(barisMandiri < jmlBaris.numberValue){
				  console.log("baris mandiri: ",barisMandiri);
				  await delay(100);
				  const jenisPemeriksaanMandiri = getElementByXpath("(//tbody/tr)["+barisMandiri+"]//td");
				  if(arrayNamaForms.indexOf(jenisPemeriksaanMandiri.textContent) > -1){ //ada
					const centangMandiri = getElementByXpath("(//tbody/tr)["+(barisMandiri+1)+"]//img");
					if(centangMandiri.src == "https://sehatindonesiaku.kemkes.go.id/images/icons/icon-success-gray.svg"){
						//belum periksa
						setRow(barisMandiri);
						await delay(100);
						getElementByXpath("(//tbody/tr)["+(barisMandiri+1)+"]//button")?.click();
					}else{ //sudah diperiksa
						barisMandiri++;
						await delay(100);
					}
				  }else{ //tidak ada jenis pemeriksaan yang dimaksud dalam kamus
					barisMandiri++;
					await delay(100);
				  }
				}
				//kalo sudah habis maka lanjut ke pemeriksaan oleh nakes, tapi set dulu {jenisPemeriksaan : "nakes"}
				console.log("Pemeriksaan mandiri sudah selesai.");
				setPemeriksa("nakes");
				chrome.storage.local.remove(["row"]);
				location.reload();
			}else{
				console.log("Pemeriksaan mandiri tidak terdeteksi.");
				location.reload();
			}
			break;
		default : //should be nakes
			const arrayFormLayanan = await getForms();
			if(arrayFormLayanan === undefined){
				const arrayForms = [];
				const divs = document.querySelectorAll('#tableLayanan .col-span-2');
				divs.forEach(div => {
				  const text = div.textContent.trim();

				  // Condition #1: first column text is in myArray
				  if (arrayNamaForms.includes(text)) {
					// Condition #1: check the 3rd column (two siblings later)
					const secondCol = div.parentElement.children[1]; // index 2 = second column

					if (secondCol) {
						// Look for descendant with the target text
						const hasStatus = Array.from(secondCol.querySelectorAll('*'))
						.some(el => {
							const t = el.textContent.trim();
							return t === "Belum Pemeriksaan";
						});
						if (hasStatus) {
							//save to array
							arrayForms.push(text);
						}
					}
				  }
				});
				if(arrayForms.length > 0){
					clickInputData(arrayForms)
				}else{
					finishingDetailPemeriksaan();
				}
			}else{
				const parsedArrayForm = JSON.parse(arrayFormLayanan);
				if(parsedArrayForm.length == 0){
					finishingDetailPemeriksaan();
				}else{
					clickInputData(parsedArrayForm)
				}
			}
			break;
	}
}

async function autoFill(){
	await delay(500);
	if(window.location.origin == "https://form.kemkes.go.id"){
		fillForm();
	}else{
		await delay(500);
		if(/^https:\/\/sehatindonesiaku\.kemkes\.go\.id\/ckg-pelayanan\/detail-pemeriksaan/.test(window.location.href)){
			//cek apakah sudah mulai pemeriksaan atau belum?
			getLayananState();
		}else{ //https://sehatindonesiaku.kemkes.go.id/ckg-pelayanan
			awalMulaiDetailPemeriksaan();
		}
	}
}
// === Auto Resume After Reload ===
window.addEventListener("load", async () => {
	await delay(500); // wait 1 seconds more
	chrome.runtime.sendMessage({ action: "getStates" }, (response) => {
		if(response.isRunning){ //true
			autoFill();
		}
	});
});

// ============= Main Controller ===========================
chrome.runtime.onMessage.addListener(async(request, sender, sendResponse) => {
  if (request.action === "runAutofill") {
	  autoFill();
	  // Keep sendResponse alive for async calls
	return true;
  }
});
//============= end here =================



