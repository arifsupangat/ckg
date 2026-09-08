// === Helpers ===
function getElementByXpath(path) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
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

async function waitForXPath(xpath) {
  return new Promise(resolve => {
    const check = () => {
      const el = getElementByXpath(xpath);
      if (el instanceof HTMLElement) {
        resolve(el);
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// === Shared Helpers ===
function setStep(n) {
  chrome.storage.local.set({ step: n });
}
function getStep() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["step"], (result) => {
      resolve(parseInt(result.step || "0", 10));
    });
  });
}


let isRunning = false;
// === Main Runner ===
async function runSequence(step = 0) {
  console.log("Running step:", step);
  chrome.storage.local.get("step", (result) => {
    console.log("Current step:", result.step);
  });

  if(step < 1){
    //getElementByXpath("(//div[contains(@class, 'tracking-wide') and contains(text(), 'Mulai')])[1]")?.click();
    //await delay(1000);
    if (!isRunning) return;
    setStep(1);
  }
  //reload
  if(step < 2){
    if (!isRunning) return;
    await delay(1000);
    const divUmur = getElementByXpath("//div[contains(., 'Umur Saat Pemeriksaan')]/following-sibling::div[1]");
    const usia = divUmur.textContent;
    const usiaInt = parseInt(usia.substring(0,usia.indexOf(" Tahun")));
    chrome.storage.local.set({umur: usiaInt});
    switch(usiaInt){
      case 0 : //gak ada input data pemeriksaan mandiri lanjut ke imunisasi hepatitis B , berat lahir, jantung bawaan, darah tumit, dan edukasi tinja
        getElementByXpath("//div[contains(@class, 'tracking-wide') and contains(text(), 'Mulai Pemeriksaan ')]")?.click();
        await delay(1000);
        getElementByXpath("//div[contains(@class, 'tracking-wide') and contains(text(), 'Simpan')]")?.click();//simpan tanggal pemeriksaan
        setStep(291);
      break;
      case 1 : //ada demografi lanjut ke pertumbuhan perkembangan, telinga mata, gds, gigi, tb, tb lanjutan, frambusia kusta skabies
        getElementByXpath("//div[contains(@class, 'tracking-wide') and contains(text(), 'Mulai Pemeriksaan ')]")?.click();
        await delay(1000);
        getElementByXpath("//div[contains(@class, 'tracking-wide') and contains(text(), 'Simpan')]")?.click();//simpan tanggal pemeriksaan
        setStep(7); //ke demografi --> telinga mata (1 - 2 tahun) --> pertumbuhan perkembangan
      break;
      case 2 : //ada demografi dan imunisasi lanjut pertumbuhan perkembangan, telinga mata, gds, gigi, tb, tb lanjutan, frambusia kusta skabies
        getElementByXpath("//div[contains(@class, 'tracking-wide') and contains(text(), 'Mulai Pemeriksaan ')]")?.click();
        await delay(1000);
        getElementByXpath("//div[contains(@class, 'tracking-wide') and contains(text(), 'Simpan')]")?.click();//simpan tanggal pemeriksaan
        setStep(5); //ke imunisasi --> demografi --> telinga mata (1 - 2 tahun) --> pertumbuhan perkembangan
        break;
      case 3 : //ada demografi , diabetes dan imunisasi lanjut pertumbuhan perkembangan, telinga mata, gds, gigi, tb, tb lanjutan, frambusia kusta skabies
      case 4 : //ada demografi , diabetes dan imunisasi pertumbuhan perkembangan, telinga mata, gds, gigi, tb, tb lanjutan, frambusia kusta skabies
      case 5 : //mirip sama umur 3 dan 4 cuma bedanya pertumbuhan perkembangan diganti gizi anak IMT/U
      case 6 : //mirip sama umur 3 dan 4 cuma bedanya pertumbuhan perkembangan diganti gizi anak IMT/U   
          getElementByXpath("//div[contains(@class, 'tracking-wide') and contains(text(), 'Mulai Pemeriksaan ')]")?.click();
          await delay(1000);
          getElementByXpath("//div[contains(@class, 'tracking-wide') and contains(text(), 'Simpan')]")?.click();//simpan tanggal pemeriksaan
          setStep(3); //ke diabetes --> imunisasi --> demografi  --> telinga mata apras --> pertumbuhan perkembangan
        break;
      default :
        setStep(98);
        break;
    }
    if (!isRunning) return;
    setStep(2);
  }

  //input data oleh peserta 
  //Faktor Risiko Gula Darah Anak
  if(step < 3){
    if (!isRunning) return;
    const elRisikoGulaDarahAnak = await waitForXPath("//td[contains(., 'Faktor Risiko Gula Darah Anak')]/following-sibling::td[2]//div[contains(@class, 'tracking-wide') and contains(text(), 'Input Data')]");
    elRisikoGulaDarahAnak.click();
    if (!isRunning) return;
    setStep(3);
  }
  //reload
  if(step < 4){
    if (!isRunning) return;
    await delay(500);
    const elApakahDM = await waitForXPath("//input[@value='PPV00001035']"); //radio
    elApakahDM.click();
    await delay(1000); //ada muncul pertanyaan selanjutnya
    getElementByXpath("//input[@value='PPV00000483']")?.click();
    getElementByXpath("//input[@value='PPV00000485']")?.click();
    getElementByXpath("//input[@value='PPV00000491']")?.click();
    getElementByXpath("//input[@value='PPV00000493']")?.click();
    getElementByXpath("//input[@value='Kirim']")?.click();
    await delay(1000);
    if (!isRunning) return;
    setStep(4);
  }

  //Riwayat Imunisasi Rutin Balita
  if(step < 5){
    if (!isRunning) return;
    await delay(1000);
    const elImunisasiRutin = await waitForXPath("//td[contains(., 'Riwayat Imunisasi Rutin Balita')]/following-sibling::td[2]//div[contains(@class, 'tracking-wide') and contains(text(), 'Input Data')]");
    elImunisasiRutin.click();
    if (!isRunning) return;
    setStep(5);
  }
  //reload
  if(step < 6){
    if (!isRunning) return;
    await delay(500);
    const elApakahImunisasiRutin = await waitForXPath("(//div[@class='sv-dropdown_select-wrapper'])[1]"); //dropdown
    elApakahImunisasiRutin.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]//div[@title='Ya']")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]//div[@title='Ya']")?.click();
    await delay(500);
    //setelah itu muncul banyak pertanyaan
    for(var n=3;n<(document.getElementsByClassName("sv-dropdown_select-wrapper").length+1);n++){
      getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])["+n+"]")?.click();
      await delay(100);
      getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])["+n+"]//div[@title='Sudah']")?.click();
      await delay(100);
    }
    await delay(1000);
    getElementByXpath("//input[@value='Kirim']")?.click();
    if (!isRunning) return;
    setStep(6);
  }

  //Demografi Anak
  if(step < 7){
    if (!isRunning) return;
    await delay(500);
    const elDemografi = await waitForXPath("//td[contains(., 'Demografi Anak')]/following-sibling::td[2]//div[contains(@class, 'tracking-wide') and contains(text(), 'Input Data')]");
    elDemografi.click();
    if (!isRunning) return;
    setStep(7);
  }
  //reload
  if(step < 8){
    if (!isRunning) return;
    await delay(500);
    const elDisabilitas = await waitForXPath("//input[@value=\"PPV00000561\"]"); //radio
    elDisabilitas.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
    if (!isRunning) return;
    setStep(8);
  }

  //percabangan pertumbuhan perkembangan beda antara 1-4 dengan 5 dan 6
  if(step < 9){
    if (!isRunning) return;
    await delay(500);
    const opsiUsia = parseInt(chrome.storage.local.get("step") || "0", 10);
    if(opsiUsia > 4){ //untuk 5 dan 6
      const elIMT = await waitForXPath("//div[contains(., 'Gizi Anak IMT/U')]/following-sibling::div[3]//div[contains(@class, 'tracking-wide') and contains(text(), 'Input Data')]");
      elIMT.click();
      if (!isRunning) return;
      setStep(10);
    }else{
      const elTBBB = await waitForXPath("//div[contains(., 'Skrining Pertumbuhan - Balita dan Anak Prasekolah 1-5 Tahun')]/following-sibling::div[3]//div[contains(@class, 'tracking-wide') and contains(text(), 'Input Data')]");
      elTBBB.click();
      if (!isRunning) return;
      setStep(9);
    }
  }
  //reload
  if(step < 10){ //untuk 1, 2, 3, dan 4
    if (!isRunning) return;
    await delay(1000);
    const umurInt = parseInt(chrome.storage.local.get("step") || "0", 10);
    const bbBalita = umurInt + 10;
    const tbBalita = 65 + ((bbBalita - 10) * 10);
    forceInput(document.getElementById("sq_100i"), bbBalita); 
    await new Promise((r) => setTimeout(r, 1500));
    forceInput(document.getElementById("sq_101i"), tbBalita); 
    await new Promise((r) => setTimeout(r, 1500));
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]//div[@title='Berdiri']")?.click();
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]//div[@title='Normal']")?.click();
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    if (!isRunning) return;
    if(umur < 3){
      setStep(11); //ke telinga mata 1 da n 2
    }else{
      setStep(13);// ke telinga mata 23456
    }
  }
  //reload //gizi anak IMT/U
  if(step < 11){ //untuk 5 dan 6
    if (!isRunning) return;
    await delay(1000);
    const elBBbalita = await waitForXPath("//input[@id='sq_100i']"); //input text
    forceInput(document.getElementById("sq_100i"), "16"); 
    await new Promise((r) => setTimeout(r, 150));
    forceInput(document.getElementById("sq_101i"), "108"); 
    await new Promise((r) => setTimeout(r, 150));
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    if (!isRunning) return;
    setStep(13);
  }
  
  //telinga mata 1 dan 2
  if(step < 12){
    if (!isRunning) return;
    await delay(500);
    const elTelinga12 = await waitForXPath("//div[contains(., 'Skrining Telinga dan Mata (1-2 tahun)')]/following-sibling::div[3]//div[contains(@class, 'tracking-wide') and contains(text(), 'Input Data')]");
    elTelinga12.click();
    if (!isRunning) return;
    setStep(12);
  }
  //reload
  if(step < 13){
    if (!isRunning) return;
    await delay(500);
    const elSerumen = await waitForXPath("(//div[@class='sv-dropdown_select-wrapper'])[1]"); //dropdown
    elTelingaGimana.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]//div[@title='Tidak ada serumen impaksi']")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]//div[@title='Tidak ada infeksi telinga']")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[3]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[3]//div[@title='Sesuai Umur']")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[4]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[4]//div[@title='Normal']")?.click();
    await delay(100);
    //value="PPV00000109" name="LPM000048|FRM000085|PPM00000078|text_sq_104"
    getElementByXpath("//input[@value='PPV00000109']")?.click();
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    if (!isRunning) return;
    setStep(15);
  }

  //telinga mata 3 dan 4 , 5 dan 6
  if(step < 14){
    if (!isRunning) return;
    await delay(1000);
    const elTelinga3 = await waitForXPath("//div[contains(., 'Skrining Telinga dan Mata - Balita dan Anak Prasekolah')]/following-sibling::div[3]//div[contains(@class, 'tracking-wide') and contains(text(), 'Input Data')]");
    elTelinga3.click();
    if (!isRunning) return;
    setStep(14);
  }
  //reload
  if(step < 15){
    if (!isRunning) return;
    await delay(500);
    const elMataGimana = await waitForXPath("(//div[@class='sv-dropdown_select-wrapper'])[1]"); //dropdown
    elMataGimana.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]//div[@title='Sesuai Umur']")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]//div[@title='Daya lihat anak baik (visus >6/12 atau >6/60)']")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[3]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[3]//div[@title='Tidak ada serumen impaksi']")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[4]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[4]//div[@title='Tidak ada infeksi telinga']")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[5]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[5]//div[@title='Normal']")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
    if (!isRunning) return;
    setStep(15);
  }

  //gds 123456
  if(step < 16){
    if (!isRunning) return;
    await delay(500);
    const elGDSanak = await waitForXPath("//div[contains(., 'Pemeriksaan Gula Darah Anak')]/following-sibling::div[3]//div[contains(@class, 'tracking-wide') and contains(text(), 'Input Data')]");
    elGDSanak.click();
    if (!isRunning) return;
    setStep(16);
  }
  //reload
  if(step < 17){
    if (!isRunning) return;
    await delay(1000);
    const elTerdiagnosaDM = await waitForXPath("//input[@value='PPV00001035']"); //radio
    elTerdiagnosaDM.click();
    forceInput(document.getElementById("sq_102i"), "90"); 
    await new Promise((r) => setTimeout(r, 1500));
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    if (!isRunning) return;
    setStep(17);
  }

  //gigi
  if(step < 18){
    if (!isRunning) return;
    await delay(500);
    const elGigi = await waitForXPath("//div[contains(., 'Pemeriksaan Gigi - Anak')]/following-sibling::div[3]//div[contains(@class, 'tracking-wide') and contains(text(), 'Input Data')]");
    elGigi.click();
    if (!isRunning) return;
    setStep(18);
  }
  //reload
  if(step < 19){
    if (!isRunning) return;
    await delay(500);
    //value="PPV00000712" name="LPM000094|FRM000131|PPM00000393|text_sq_100"
    const elKaries = await waitForXPath("//input[@value='PPV00000712']"); //radio
    elKaries.click();
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    if (!isRunning) return;
    setStep(19);
  }
  
  //tb
  if(step < 20){
    if (!isRunning) return;
    await delay(1000);
    const elTB = await waitForXPath("//div[contains(., 'Faktor Risiko dan Skrining X-Ray TB (Anak 1-9 tahun)')]/following-sibling::div[3]//div[contains(@class, 'tracking-wide') and contains(text(), 'Input Data')]");
    elTB.click();
    if (!isRunning) return;
    setStep(20);
  }
  //reload
  if(step < 21){
    if (!isRunning) return;
    await delay(1000);
    //value="PPV00001238" name="LPM000129|FRM000175|PPM00000693|text_sq_100"
    const elApakahTB = await waitForXPath("//input[@value='PPV00001238']"); //radio
    elApakahTB.click();
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
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    if (!isRunning) return;
    setStep(21);
  }
  
  //tb lanjutan
  if(step < 22){
    if (!isRunning) return;
    await delay(500);
    const elTBlanjutan = await waitForXPath("//div[contains(., 'Pemeriksaan Tuberkulosis (Anak)')]/following-sibling::div[3]//div[contains(@class, 'tracking-wide') and contains(text(), 'Input Data')]")?.click();
    elTBlanjutan.click();
    if (!isRunning) return;
    setStep(22);
  }
  //reload
  if(step < 23){
    if (!isRunning) return;
    await delay(500);
    const elApakahKontakTB = await waitForXPath("(//div[@class='sv-dropdown_select-wrapper'])[1]"); //dropdown
    elApakahKontakTB.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]//div[@title='Tidak ada']")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]//div[@title='Tidak dilakukan']")?.click();
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    if (!isRunning) return;
    setStep(23);
  }
  
  //Pemeriksaan Penyakit Frambusia (untuk daerah endemis atau berisiko frambusia)
  if(step < 24){
    if (!isRunning) return;
    await delay(500);
    const elFrambusia = await waitForXPath("//div[contains(., 'Pemeriksaan Penyakit Frambusia (untuk daerah endemis atau berisiko frambusia)')]/following-sibling::div[3]//div[contains(@class, 'tracking-wide') and contains(text(), 'Input Data')]");
    elFrambusia.click();
    if (!isRunning) return;
    setStep(24);
  }
  //reload
  if(step < 25){
    if (!isRunning) return;
    await delay(500);
    //value="PPV00001303" name="LPM000121|FRM000199|PPM00000587|text_sq_100"
    const elApakahFrambusia = await waitForXPath("//input[@value='PPV00001303']"); //radio
    elApakahFrambusia.click();
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    if (!isRunning) return;
    setStep(25);
  }

  //Pemeriksaan Penyakit Kusta
  if(step < 26){
    if (!isRunning) return;
    await delay(1000);
    const elKusta = await waitForXPath("//div[contains(., 'Pemeriksaan Penyakit Kusta')]/following-sibling::div[3]//div[contains(@class, 'tracking-wide') and contains(text(), 'Input Data')]");
    elKusta.click();
    if (!isRunning) return;
    setStep(26);
  }
  //reload
  if(step < 27){
    if (!isRunning) return;
    await delay(500);
    const elApakahKusta = await waitForXPath("(//div[@class='sv-dropdown_select-wrapper'])[1]"); //drop down
    elApakahKusta.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]//div[@title='Tidak Ada']")?.click();
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    if (!isRunning) return;
    setStep(27);
  }

  //Pemeriksaan Penyakit Skabies
  if(step < 28){
    if (!isRunning) return;
    await delay(1000);
    const elSkabies = await waitForXPath("//div[contains(., 'Pemeriksaan Penyakit Skabies')]/following-sibling::div[3]//div[contains(@class, 'tracking-wide') and contains(text(), 'Input Data')]");
    elSkabies.click();
    if (!isRunning) return;
    setStep(28);
  }
  //reload
  if(step < 29){
    if (!isRunning) return;
    await delay(500);
    const elApakahSkabies = await waitForXPath("(//div[@class='sv-dropdown_select-wrapper'])[1]"); //drop down
    elApakahSkabies.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]//div[@title='Tidak Ada']")?.click();
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    if (!isRunning) return;
    setStep(97);
  }
  
  //imunisasi hepatitis B
  if(step < 30){
    if (!isRunning) return;
    await delay(500);
    const elImunisasiHepatitis = await waitForXPath("//div[contains(., 'Edukasi Warna Kulit dan Tinja Bayi')]/following-sibling::div[3]//div[contains(@class, 'tracking-wide') and contains(text(), 'Input Data')]");
    elImunisasiHepatitis.click();
    if (!isRunning) return;
    setStep(30);
  }
  //reload
  if(step < 31){
    if (!isRunning) return;
    await delay(500);
    //value="PPV00001304" name="LPM000175|FRM000260|PPM00000762|text_sq_100"
    const elApakahImunisasiHepatitis = await waitForXPath("//input[@value=\"PPV00001304\"]"); //radio
    elApakahImunisasiHepatitis.click();
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    if (!isRunning) return;
    setStep(31);
  }

  //berat lahir
  if(step < 32){
    if (!isRunning) return;
    await delay(500);
    const elBeratLahir = await waitForXPath("//div[contains(., 'Berat Lahir')]/following-sibling::div[3]//div[contains(@class, 'tracking-wide') and contains(text(), 'Input Data')]");
    elBeratLahir.click();
    if (!isRunning) return;
    setStep(32);
  }
  //reload
  if(step < 33){
    if (!isRunning) return;
    await delay(500);
    const elBBlahir = await waitForXPath("//input[@id='sq_100i']"); //input text number
    forceInput(document.getElementById("sq_100i"), 3300); 
    await new Promise((r) => setTimeout(r, 150));
    await delay(1000);
    forceInput(document.getElementById("sq_101i"), 5000); 
    await new Promise((r) => setTimeout(r, 150));
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    if (!isRunning) return;
    setStep(33);
  }

  //jantung bawaan
  if(step < 34){
    if (!isRunning) return;
    await delay(500);
    const elJantungBawaan = await waitForXPath("//div[contains(., 'Skrining Penyakit Jantung Bawaan')]/following-sibling::div[3]//div[contains(@class, 'tracking-wide') and contains(text(), 'Input Data')]");
    elJantungBawaan.click();
    if (!isRunning) return;
    setStep(34);
  }
  //reload
  if(step < 35){
    if (!isRunning) return;
    await delay(500);
    const elBBlahir = await waitForXPath("//input[@id='sq_100i']"); //input text number
    forceInput(document.getElementById("sq_100i"), 97); 
    await new Promise((r) => setTimeout(r, 150));
    await delay(1000);
    forceInput(document.getElementById("sq_101i"), 98); 
    await new Promise((r) => setTimeout(r, 150));
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    if (!isRunning) return;
    setStep(33);
  }

  //edukasi tinja
  if(step < 38){
    if (!isRunning) return;
    await delay(500);
    const elEdukasiKulitTinja = await waitForXPath("//div[contains(., 'Edukasi Warna Kulit dan Tinja Bayi')]/following-sibling::div[3]//div[contains(@class, 'tracking-wide') and contains(text(), 'Input Data')]");
    elEdukasiKulitTinja.click();
    if (!isRunning) return;
    setStep(38);
  }
  //reload
  if(step < 39){
    if (!isRunning) return;
    await delay(500);
    //value="PPV00000040" name="LPM000044|FRM000079|PPM00000036|text_sq_100"
    const elApakahEdukasi = await waitForXPath("//input[@value=\"PPV00000040\"]"); //radio
    elApakahEdukasi.click();
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    if (!isRunning) return;
    setStep(97);
  }

  //selesaikan layanan
  if(step < 98){
    if (!isRunning) return;
    getElementByXpath("//div[contains(@class, 'tracking-wide') and contains(text(), 'Selesaikan Layanan')]")?.click();
    await delay(1000);
    chrome.storage.local.remove(["step", "umur"]);
  }
}

// === Auto Resume After Reload ===
window.addEventListener("load", async () => {
    await delay(1000); // wait 1 seconds more
    const step = await getStep();
    await delay(1000);
    if(isRunning){
      runSequence(step);
    }
});

// ============= Main Controller ===========================
chrome.runtime.onMessage.addListener(async(request, sender, sendResponse) => {
  if (request.action === "disabilitas") {
    getElementByXpath("//input[@value=\"PPV00000561\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
    sendResponse({status: "Demografi anak terisi"});
  }

  if(request.action === "demografiDewasaPerempuan"){ 
    //value="PPV00000337" name="LPM000063|FRM000007|PPM00000172|text_sq_100"
    getElementByXpath("//input[@value=\"PPV00000337\"]")?.click();  //belum menikah
    await delay(1000); //muncul rencana menikah dalam setahun ini
    //value="PPV00000344" name="LPM000063|FRM000007|PPM00000174|text_sq_101"
    getElementByXpath("//input[@value=\"PPV00000344\"]")?.click(); //tidak ada rencana menikah dalam setahun
    //value="PPV00000342" name="LPM000063|FRM000007|PPM00000173|text_sq_102" Apakah sedang hamil? tidak
    getElementByXpath("//input[@value=\"PPV00000342\"]")?.click();
    //value="PPV00000561" name="LPM000063|FRM000007|PPM00000299|text_sq_103"
    getElementByXpath("//input[@value=\"PPV00000561\"]")?.click(); //nondisabilitas btw sama dengan yg nondisabilitas anak PPV00000561
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
    sendResponse({status: "Demografi Dewasa Perempuan terisi"});
  }

  if(request.action === "demografiDewasaLaki"){ 
    //value="PPV00000337" name="LPM000056|FRM000006|PPM00000172|text_sq_100"
    getElementByXpath("//input[@value=\"PPV00000337\"]")?.click();  //belum menikah
    await delay(1000); //muncul rencana menikah dalam setahun ini
    //value="PPV00000344" name="LPM000056|FRM000006|PPM00000174|text_sq_101"
    getElementByXpath("//input[@value=\"PPV00000344\"]")?.click(); //tidak ada rencana menikah dalam setahun
    //value="PPV00000561" name="LPM000056|FRM000006|PPM00000299|text_sq_102"
    getElementByXpath("//input[@value=\"PPV00000561\"]")?.click(); //nondisabilitas btw sama dengan yg nondisabilitas anak PPV00000561
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
    sendResponse({status: "Demografi Dewasa Laki-laki terisi"});
  }

  if(request.action === "demografiLansia"){ 
    //value="PPV00000338" name="LPM000064|FRM000008|PPM00000172|text_sq_100"
    getElementByXpath("//input[@value=\"PPV00000338\"]")?.click();  //menikah
    //value="PPV00000561" name="LPM000064|FRM000008|PPM00000299|text_sq_101"
    getElementByXpath("//input[@value=\"PPV00000561\"]")?.click(); //nondisabilitas btw sama dengan yg nondisabilitas anak PPV00000561
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
    sendResponse({status: "Demografi Lansia terisi"});
  }

  if (request.action === "imunisasiRutin") {
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]//div[@title='Ya']")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]//div[@title='Ya']")?.click();
    await delay(1000);
    //setelah itu muncul banyak pertanyaan
    for(var n=3;n<(document.getElementsByClassName("sv-dropdown_select-wrapper").length+1);n++){
      getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])["+n+"]")?.click();
      await delay(100);
      getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])["+n+"]//div[@title='Sudah']")?.click();
      await delay(100);
    }
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
    sendResponse({status: "Imunisasi rutin terisi"});
  }

  if (request.action === "diabetes") {
    getElementByXpath("//input[@value='PPV00001035']")?.click();
    await delay(1000); //ada muncul pertanyaan selanjutnya
    getElementByXpath("//input[@value='PPV00000483']")?.click();
    getElementByXpath("//input[@value='PPV00000485']")?.click();
    getElementByXpath("//input[@value='PPV00000491']")?.click();
    getElementByXpath("//input[@value='PPV00000493']")?.click();
	await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
    sendResponse({status: "Faktor Risiko Gula terisi"});
  }

  if (request.action === "risikoMalaria") {
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
    sendResponse({status: "Pemeriksaan Malaria terisi"});
  }

  if (request.action === "risikoTBdewasaLansia") {
    //value="PPV00000883" name="LPM000131|FRM000180|PPM00000477|text_sq_100"
    getElementByXpath("//input[@value=\"PPV00000883\"]")?.click(); //tidak batuk
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
  }

  if (request.action === "risikoKankerUsus") {
    //value="PPV00000348" checked="" name="LPM000060|FRM000027|PPM00000175|text_sq_100"
    //value="PPV00000538" checked="" name="LPM000060|FRM000027|PPM00000288|text_sq_101"
    getElementByXpath("//input[@value='PPV00000348']")?.click();
    getElementByXpath("//input[@value='PPV00000538']")?.click();
	await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
    sendResponse({status: "Faktor Risiko Kanker Usus terisi"});
  }

  if (request.action === "kankerParu") {
    //value="PPV00001025" checked="" name="LPM000105|FRM000138|PPM00000561|text_sq_100"
    //value="PPV00001027" checked="" name="LPM000105|FRM000138|PPM00000562|text_sq_101"
    //value="PPV00001029" checked="" name="LPM000105|FRM000138|PPM00000563|text_sq_102"
    //value="PPV00000737" checked="" name="LPM000105|FRM000138|PPM00000402|text_sq_103"
    //value="PPV00001031" checked="" name="LPM000105|FRM000138|PPM00000564|text_sq_104"
    //value="PPV00001033" checked="" name="LPM000105|FRM000138|PPM00000565|text_sq_105"
    getElementByXpath("//input[@value=\"PPV00001025\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00001027\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00001029\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000737\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00001031\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00001033\"]")?.click();
	await delay(500);
	getElementByXpath("//input[@value='Kirim']")?.click();
    sendResponse({status: "Faktor Risiko Kanker Paru terisi"});
  }
  
  if (request.action === "kankerParu45") {
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
	await delay(500);
	getElementByXpath("//input[@value='Kirim']")?.click();
    sendResponse({status: "Faktor Risiko Kanker Usus terisi"});
  }

  if (request.action === "risikoKankerLeherRahim") {
    //value="PPV00000346" name="LPM000062|FRM000088|PPM00000171|text_sq_100"
    getElementByXpath("//input[@value=\"PPV00000346\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
	sendResponse({status: "Pemeriksaan Risiko Kanker Rahim terisi"});
  }

  if (request.action === "imt") {
    // Example: click a button
    forceInput(document.getElementById("sq_100i"), request.bbSekarang); 
    await new Promise((r) => setTimeout(r, 500));
    forceInput(document.getElementById("sq_101i"), request.tbSekarang); 
    await new Promise((r) => setTimeout(r, 500));
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "IMT/U terisi"});
  }

  if (request.action === "tbbb") {
    forceInput(document.getElementById("sq_100i"), request.bbSekarang); 
    await new Promise((r) => setTimeout(r, 500));
    forceInput(document.getElementById("sq_101i"), request.tbSekarang); 
    await new Promise((r) => setTimeout(r, 600));
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]//div[@title='Berdiri']")?.click();
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]//div[@title='Normal']")?.click();
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "Tumbuh kembang anak terisi."});
  }

  if (request.action === "imtDewasaPerempuan") {
    forceInput(document.getElementById("sq_100i"), request.bbSekarang); 
    await new Promise((r) => setTimeout(r, 500));
    forceInput(document.getElementById("sq_101i"), request.tbSekarang); 
    await new Promise((r) => setTimeout(r, 600));
    forceInput(document.getElementById("sq_102i"), request.lp); 
    await new Promise((r) => setTimeout(r, 550));
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "TT BB dewasa perempuan terisi."});
  }

  if (request.action === "imtDewasaLaki") {
    forceInput(document.getElementById("sq_100i"), request.bbSekarang); 
    await new Promise((r) => setTimeout(r, 500));
    forceInput(document.getElementById("sq_101i"), request.tbSekarang); 
    await new Promise((r) => setTimeout(r, 600));
    forceInput(document.getElementById("sq_102i"), request.lp); 
    await new Promise((r) => setTimeout(r, 550));
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "TT BB dewasa laki-laki terisi."});
  }

  if (request.action === "keswa") {
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
    sendResponse({status: "Kesehatan Jiwa terisi"});
  }

  if (request.action === "gejalaCemas") {
    //value="PPV00000593" name="LPM000104|FRM000112|PPM00000321|text_sq_100"
    //value="PPV00000599" name="LPM000104|FRM000112|PPM00000325|text_sq_101"
    //value="PPV00000605" name="LPM000104|FRM000112|PPM00000329|text_sq_102"
    getElementByXpath("//input[@value=\"PPV00000593\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000599\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000605\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
    sendResponse({status: "Gejala Cemas terisi"});
  }

  if (request.action === "gejalaDepresi") {
    //value="PPV00000627" name="LPM000104|FRM000125|PPM00000343|text_sq_100"
    //value="PPV00000629" name="LPM000104|FRM000125|PPM00000345|text_sq_101"
    //value="PPV00000633" name="LPM000104|FRM000125|PPM00000347|text_sq_102"
    getElementByXpath("//input[@value=\"PPV00000627\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000629\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000633\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
    sendResponse({status: "Gejala Depresi terisi"});
  }

  if (request.action === "reproduksiPutra") {
    //value="PPV00000589" name="LPM000088|FRM000126|PPM00000318|text_sq_100"
    //value="PPV00000595" name="LPM000088|FRM000126|PPM00000322|text_sq_101"
    //value="PPV00000603" name="LPM000088|FRM000126|PPM00000327|text_sq_102"
    getElementByXpath("//input[@value=\"PPV00000589\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000595\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000603\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
    sendResponse({status: "Reproduksi Putra terisi"});
  }

  if (request.action === "merokok") {
    //value="PPV00000365" checked="" name="LPM000057|FRM000064|PPM00000183|text_sq_100"
    //value="PPV00000426" checked="" name="LPM000057|FRM000064|PPM00000185|text_sq_104"
    //value="PPV00000439" checked="" name="LPM000057|FRM000064|PPM00000218|text_sq_107"
    getElementByXpath("//input[@value=\"PPV00000365\"]")?.click();
	await delay(500);
    getElementByXpath("//input[@value=\"PPV00000426\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000439\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
    sendResponse({status: "Perilaku merokok terisi"});
  }

  if (request.action === "merokokSekolah") {
    //value="PPV00000365" name="LPM000085|FRM000118|PPM00000183|text_sq_100"
    //value="PPV00000439" name="LPM000085|FRM000118|PPM00000218|text_sq_104"
    getElementByXpath("//input[@value=\"PPV00000365\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000426\"]")?.click();
    getElementByXpath("//input[@value=\"PPV00000439\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
    sendResponse({status: "Perilaku merokok di sekolah terisi"});
  }

  if (request.action === "aktivitas") {
    for(var n=1;n<(document.getElementsByClassName("sv-dropdown_select-wrapper").length+1);n++){
      getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])["+n+"]")?.click();
      await delay(100);
      getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])["+n+"]//div[@title='Tidak']")?.click();
      await delay(100);
    }
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
    sendResponse({status: "Aktivitas Fisik (sedang dan berat) terisi"});
  }

  if (request.action === "aktivitasRemaja") {
    forceInput(document.getElementById("sq_100i"), "7"); 
    await new Promise((r) => setTimeout(r, 500));
    forceInput(document.getElementById("sq_101i"), "7"); 
    await new Promise((r) => setTimeout(r, 600));
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "Tingkat Aktivitas Fisik terisi."});
  }

  if (request.action === "kebugaran") {
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
    sendResponse({status: "pemeriksaan kebugaran terisi"});
  }

  if (request.action === "kebugaranJasmani") {
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]//div[@title='Baik sekali']")?.click();
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "Pemeriksaan Kusta terisi."});
  }

  if (request.action === "tensiAnakRemaja") {
    forceInput(document.getElementById("sq_100i"), request.sistole); 
    await new Promise((r) => setTimeout(r, 500));
    forceInput(document.getElementById("sq_101i"), request.diastole); 
    await new Promise((r) => setTimeout(r, 600));
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "tekanan darah pada remaja terisi."});
  }

  if (request.action === "telingamata12") {
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]//div[@title='Tidak ada serumen impaksi']")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]//div[@title='Tidak ada infeksi telinga']")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[3]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[3]//div[@title='Sesuai Umur']")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[4]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[4]//div[@title='Normal']")?.click();
    await delay(100);
    //value="PPV00000109" name="LPM000048|FRM000085|PPM00000078|text_sq_104"
    getElementByXpath("//input[@value='PPV00000109']")?.click();
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "Pemeriksaan Telinga dan Mata usia 1-2 tahun terisi."});
  }
   
  if (request.action === "telingamata3456") {
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]//div[@title='Sesuai Umur']")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]//div[@title='Daya lihat anak baik (visus >6/12 atau >6/60)']")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[3]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[3]//div[@title='Tidak ada serumen impaksi']")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[4]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[4]//div[@title='Tidak ada infeksi telinga']")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[5]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[5]//div[@title='Normal']")?.click();
    await delay(500);
    getElementByXpath("//input[@value='Kirim']")?.click();
    sendResponse({status: "Pemeriksaan Telinga Mata usia 3 - 6 tahun terisi."});
  }

  if (request.action === "telingaMataSekolah") {
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
    sendResponse({status: "Pemeriksaan telinga dan mata anak sekolah terisi."});
  }

  if (request.action === "mataTelinga1839") {
    //value="PPV00001020" name="LPM000031|FRM000042|PPM00000559|text_sq_100"
    getElementByXpath("//input[@value=\"PPV00001020\"]")?.click();
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]//div[@title='Tidak ada infeksi telinga']")?.click();
    await delay(100);
    //value="PPV00000022" name="LPM000031|FRM000042|PPM00000020|text_sq_102"
    getElementByXpath("//input[@value=\"PPV00000022\"]")?.click();
    //value="PPV00000044" name="LPM000031|FRM000042|PPM00000040|text_sq_104"
    getElementByXpath("//input[@value=\"PPV00000044\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "pemeriksaan mata dan telinga usia 18 - 39 terisi."});
  }

  if (request.action === "mataTelinga40") {
    //value="PPV00001020" name="LPM000054|FRM000099|PPM00000559|text_sq_100"
    getElementByXpath("//input[@value=\"PPV00001020\"]")?.click();
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]//div[@title='Tidak ada infeksi telinga']")?.click();
    await delay(100);
    //value="PPV00000022" name="LPM000054|FRM000099|PPM00000020|text_sq_102"
    getElementByXpath("//input[@value=\"PPV00000022\"]")?.click();
    //value="PPV00000044" name="LPM000054|FRM000099|PPM00000040|text_sq_104"
    getElementByXpath("//input[@value=\"PPV00000044\"]")?.click();
    //value="PPV00000099" name="LPM000054|FRM000099|PPM00000072|text_sq_109"
    getElementByXpath("//input[@value=\"PPV00000044\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "pemeriksaan mata dan telinga usia > 40 terisi."});
  }

  if (request.action === "gds") {
    getElementByXpath("//input[@value='PPV00001035']")?.click();
    forceInput(document.getElementById("sq_102i"), request.gds); 
    await new Promise((r) => setTimeout(r, 1500));
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "Pemeriksaan Gula Darah Anak terisi."});
  }

  if (request.action === "gdsDewasaLansia") {
    //value="PPV00000328" checked="" name="LPM000072|FRM000256|PPM00000160|text_sq_100"
    getElementByXpath("//input[@value='PPV00000328']")?.click();
    forceInput(document.getElementById("sq_102i"), request.gds); 
    await new Promise((r) => setTimeout(r, 1500));
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "Pemeriksaan Gula Darah Dewasa Lansia terisi."});
    
  }

  if (request.action === "tensiDewasaLansia") {
    //value="PPV00000380" checked="" name="LPM000072|FRM000265|PPM00000203|text_sq_100"
    getElementByXpath("//input[@value='PPV00000380']")?.click();
    forceInput(document.getElementById("sq_102i"), request.sistole); 
    await new Promise((r) => setTimeout(r, 250));
    forceInput(document.getElementById("sq_103i"), request.diastole); 
    await new Promise((r) => setTimeout(r, 150));
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "Tekanan Darah Dewasa Lansia terisi."});
    
  }

  if (request.action === "gilut") {
    getElementByXpath("//input[@value='PPV00000712']")?.click(); // tidak ada karies
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "Pemeriksaan Gigi Anak terisi"});
  }

  if (request.action === "gilutDewasa") {
    //value="PPV00000027" name="LPM000033|FRM000055|PPM00000025|text_sq_100"
    //value="PPV00000039" name="LPM000033|FRM000055|PPM00000035|text_sq_101"
    getElementByXpath("//input[@value='PPV00000027']")?.click(); // tidak ada karies
    getElementByXpath("//input[@value='PPV00000039']")?.click();
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "Pemeriksaan Gigi Dewasa terisi"});
  }

  if (request.action === "periodontal") {
    //value="PPV00000066" name="LPM000032|FRM000056|PPM00000044|text_sq_100"
	//value="PPV00000095" name="LPM000032|FRM000056|PPM00000070|text_sq_101"
    getElementByXpath("//input[@value='PPV00000066']")?.click();
	getElementByXpath("//input[@value='PPV00000095']")?.click();
	await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "Pemeriksaan Periodontal terisi."});
  }
   
  if (request.action === "tb") {
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
    sendResponse({status: "Pemeriksaan TB terisi."});
  }

  if (request.action === "tbDewasaLansiaXray") {
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
    sendResponse({status: "Pemeriksaan TB terisi."});
  }

  if (request.action === "epidTB") {
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]//div[@title='Tidak ada']")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[2]//div[@title='Tidak dilakukan']")?.click();
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "Pemeriksaan TB Lanjutan terisi."});
  }

  if (request.action === "frambusia") {
    getElementByXpath("//input[@value='PPV00001303']")?.click();
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "Pemeriksaan Frambusia terisi."});
  }

  if (request.action === "kusta") {
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]//div[@title='Tidak Ada']")?.click();
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "Pemeriksaan Kusta terisi."});
  }

  if (request.action === "skabies") {
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]")?.click();
    await delay(100);
    getElementByXpath("(//div[@class='sv-dropdown_select-wrapper'])[1]//div[@title='Tidak Ada']")?.click();
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "Pemeriksaan Skabies terisi."});
  }

  if (request.action === "imunisasiHepatitis") {
    getElementByXpath("//input[@value=\"PPV00001304\"]")?.click();
    await delay(500);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "Imunisasi Hepatitis B terisi."});
  }

  if (request.action === "hepatitisDewasa") {
    //value="PPV00000381" name="LPM000023|FRM000067|PPM00000192|text_sq_100"
    sendResponse({status: "Maaf pemeriksaan hepatitis dewasa belum siap."});
  }

  if (request.action === "hepatitisSMPSMA") {
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
    sendResponse({status: "Maaf pemeriksaan hepatitis SMP SMA terisi."});
  }

  if (request.action === "hati") {
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
    sendResponse({status: "Hati terisi."});
  }

  if (request.action === "bbLahir") {
    forceInput(document.getElementById("sq_100i"), request.bbLahir); 
    await new Promise((r) => setTimeout(r, 150));
    await delay(1000);
    forceInput(document.getElementById("sq_101i"), request.bbSekarang); 
    await new Promise((r) => setTimeout(r, 150));
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "Berat Lahir terisi."});
  }

  if (request.action === "jantungBawaan") {
    forceInput(document.getElementById("sq_100i"), "97"); 
    await new Promise((r) => setTimeout(r, 150));
    await delay(1000);
    forceInput(document.getElementById("sq_101i"), "98"); 
    await new Promise((r) => setTimeout(r, 150));
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "Skrining Jantung Bawaan terisi."});
  }

  if (request.action === "kulitTinja") {
    getElementByXpath("//input[@value=\"PPV00000040\"]")?.click();
    await delay(1000);
    getElementByXpath("//input[@value=\"Kirim\"]")?.click();
    sendResponse({status: "Edukasi warna Kulit dan Tinja terisi."});
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "start") {
    isRunning = true; 
    sequenceStep();
  }
  if (msg.action === "stop") {
    isRunning = false;
  }
});

/*
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", async () => {
    const step = await getStep();
    await delay(1000);
    runSequence(step);
  });
} else {
  (async () => {
    const step = await getStep();
    await delay(1000);
    runSequence(step);
  })();
}
*/
/*
const forceInput = (el, val) => {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  ).set;
  const boundSetter = Function.prototype.call.bind(setter);
  boundSetter(el, String(val));

  ["input", "change", "blur", "keyup"].forEach((e) =>
    el.dispatchEvent(new Event(e, { bubbles: true }))
  );
};
*/
/*
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

const forceInput = (el, val) => {
  el.value = String(val);
  ["input", "change", "blur", "keyup"].forEach((e) =>
    el.dispatchEvent(new Event(e, { bubbles: true }))
  );
};
*/
/*
buat riset
//pelayanan mandiri
console.log(document.getElementsByTagName('tbody')[0].rows[0].cells[0].textContent);
Demografi Dewasa Laki-Laki
console.log(document.getElementsByTagName('tbody')[0].rows[0].getElementsByTagName('img')[0].src);
https://sehatindonesiaku.kemkes.go.id/images/icons/icon-success.svg
console.log(document.getElementsByTagName('tbody')[0].rows[2].getElementsByTagName('img')[0].src);
https://sehatindonesiaku.kemkes.go.id/images/icons/icon-success-gray.svg
document.getElementsByTagName('tbody')[0].rows[2].getElementsByTagName('button')[0].click();
pelayanan oleh nakes
const elements = document.querySelectorAll('#tableLayanan');
console.log(elements.length) --> 8
console.log(elements[1].getElementsByClassName('col-span-2')[0].textContent);
Skrining Telinga dan Mata (18-39 tahun)
console.log(elements[1].getElementsByClassName('col-span-2')[0].parentElement.children[2].children[0].children[0].textContent);
Selesai diperiksa
console.log(elements[2].getElementsByClassName('col-span-2')[0].parentElement.children[2].children[0].children[0].textContent);
 Dalam Pemeriksaan 
 elements[2].getElementsByClassName('col-span-2')[0].parentElement.getElementsByTagName("button")[0].click();
*/





