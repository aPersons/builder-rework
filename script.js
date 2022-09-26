



/*--------------------------------------------
---------------------------------------------*/

let domCashe = {
  dom: {},
  domOrder: [],
  buildModal: {},
  prodNav: {},
  finalPrice: {},
}

let bTK = {
  crCats: function() {
    domCashe.dom = {}
    domCashe.domOrder = []
    let tmpList = document.querySelectorAll(".builder-part-category");
    for (const cDom of tmpList) {
      let tmphead = cDom.querySelector(".part-category-bar");
      domCashe.domOrder.push(cDom.id);
      domCashe.dom[domCashe.domOrder[domCashe.domOrder.length-1]] = {
        "selfDom": cDom,
        "headDom": tmphead,
        "isHidden": cDom.classList.contains("d-none"),
        "isEmpty": !cDom.querySelectorAll(".part-rd-bt, .part-checkbox").length,
        "pListDom": cDom.querySelector(".part-list-container"),
        "nmTxt": tmphead.textContent,
        "lpState": cDom.classList.contains("lp-show")
      }
    }
  },




  catAction: function(evArgs) {
    let ob  = domCashe.dom[evArgs.cnm];
    var action = evArgs.action ?? "toggle";

    switch(action) {
      case "open":
        if (ob.lpState) break;
        ob.lpState = true;
        ob.selfDom.classList.add("lp-show");
      break;
      case "close":
        if (!ob.lpState) break;
        ob.lpState = false;
        ob.selfDom.classList.remove("lp-show");
      break;
      case "same": break;
      default://toggle
        ob.lpState = !ob.lpState
        ob.selfDom.classList.toggle("lp-show");
    }
  },
  catGroupAction: function(evArgs) {
    for (cnm of domCashe.domOrder) {
      if (cnm == evArgs.cnm) bTK.catAction(evArgs);
      else bTK.catAction({cnm: cnm, action: "close"});
    }
  },
  CFGcHeadHandler: [],
  cHeadHandler: function() {
    let evArgs = {
      cnm: this.parentElement.parentElement.id
    }
    for (const fnc of bTK.CFGcHeadHandler) fnc(evArgs);
  },
  crCOpen: function () {
    for (const cnm of domCashe.domOrder) {
      let ob = domCashe.dom[cnm];
      ob.headDom.removeEventListener("click",bTK.cHeadHandler);
      ob.headDom.addEventListener("click",bTK.cHeadHandler);  
    }
    bTK.CFGcHeadHandler.length = 0;
    bTK.CFGcHeadHandler.push(bTK.catGroupAction);
  },




  updateRdState: function (evArgs) {
    let cnm = evArgs.cnm;
    let pnm = evArgs.pnm;
    let lastl = domCashe.dom[cnm].prodSelected;
    domCashe.dom[cnm].prodList[lastl].isSelected = false;
    domCashe.dom[cnm].prodList[pnm].isSelected = true;
    domCashe.dom[cnm].prodSelected = pnm;
  },  
  rdSelCheck: function () {
    for (const ob of Object.values(domCashe.dom)) {
      if (ob.prodType != "radio") continue;
      if (!ob.hasOwnProperty("prodSelected")) {
        ob.prodSelected = ob.prodOrder[0];
        ob.prodList[ob.prodSelected].isSelected = true;
        ob.prodList[ob.prodSelected].selfDom.checked = true;
      }
    }
  },
  rdSelect: function(pnm, cnm) {
    if (domCashe.dom[cnm].prodType == "radio")
      domCashe.dom[cnm].prodList[pnm].selfDom.click();
  },
  CFGRdBtHandler: [],
  RdBtHandler: function() {
    var evArgs = {
      pnm: this.id,
      cnm: this.parentElement.parentElement.id
    }
    for (const fnc of bTK.CFGRdBtHandler) fnc(evArgs);
  },
  crRdBt() {
    for (const cnm of domCashe.domOrder) {
      let ob = domCashe.dom[cnm];
      let tmpList = ob.selfDom.querySelectorAll(".part-rd-bt");
      if (!tmpList.length) continue;
      ob.prodType = "radio";
      ob.emptyEl = "$blank";
      ob.prodList = {};
      ob.prodOrder = [];
      for (const pob of tmpList) {
        pob.removeEventListener("change", bTK.RdBtHandler);
        pob.addEventListener("change", bTK.RdBtHandler);
        let dname = pob.id;
        ob.prodOrder.push(dname);
        let cdom = pob.nextElementSibling;
        let erpL = pob.dataset.erp;
        ob.prodList[dname] = {
          "selfDom": pob,
          "cDom": cdom,
          "nmTxt": cdom.querySelector(".part-text-head").textContent,
          "priceVal": Number(cdom.querySelector(".part-price").dataset.priceval),
          "parentCat": cnm,
          "isSelected": pob.checked,
          "value": pob.value,
          "erp": erpL ?? "-"
        }
        if (ob.prodList[dname].value == "0") ob.emptyEl = dname;
        if (ob.prodList[dname].isSelected) ob.prodSelected = dname;
      }
    }
    bTK.rdSelCheck();
    bTK.CFGRdBtHandler.length = 0;
    bTK.CFGRdBtHandler.push(bTK.updateRdState);
  },




  cbDataOpen: function(pnm, cnm) {
    domCashe.dom[cnm].prodList[pnm].isSelected = true;
    let qsize = domCashe.dom[cnm].prodSelected.length;
    let sOrd = domCashe.dom[cnm].prodOrder.indexOf(pnm);
    for (let i = 0; i < qsize; i++) {
      let lnm = domCashe.dom[cnm].prodSelected[i];
      if (sOrd<domCashe.dom[cnm].prodOrder.indexOf(lnm)) {
        domCashe.dom[cnm].prodSelected.splice(i, 0, pnm);
        return;
      }
    }
    domCashe.dom[cnm].prodSelected.push(pnm);     
  },
  cbDataClose: function(pnm, cnm) {
    domCashe.dom[cnm].prodList[pnm].isSelected = false;
    domCashe.dom[cnm].prodSelected.splice(domCashe.dom[cnm].prodSelected.indexOf(pnm), 1);      
  },
  cbOpen: function(pnm, cnm) {
    if (!domCashe.dom[cnm].prodList[pnm].isSelected) {
      domCashe.dom[cnm].prodList[pnm].selfDom.checked = true;
      bTK.cbDataOpen(pnm, cnm);
    }
  },
  cbClose: function(pnm, cnm) {
    if (domCashe.dom[cnm].prodList[pnm].isSelected) {
      domCashe.dom[cnm].prodList[pnm].selfDom.checked = false;
      bTK.cbDataClose(pnm, cnm);
    }
  },
  cbToggle: function(pnm, cnm) {
    if (domCashe.dom[cnm].prodList[pnm].isSelected) bTK.cbClose(pnm, cnm);
    else bTK.cbOpen(pnm, cnm);
  },
  updateCbState: function (evArgs) {
    let pnm = evArgs.pnm;
    let cnm = evArgs.cnm;
    let emptyEl = domCashe.dom[cnm].emptyEl;

    if (pnm == emptyEl) {
      if (domCashe.dom[cnm].prodSelected.includes(pnm)) {
        if (domCashe.dom[cnm].prodSelected.length > 1) {
          bTK.cbDataClose(pnm, cnm);
        } else {
          domCashe.dom[cnm].prodList[pnm].selfDom.checked = true;
        }
      } else {
        let lCopy = [...domCashe.dom[cnm].prodSelected];
        for (const pr of lCopy) {
          bTK.cbClose(pr, cnm);
        }
        bTK.cbDataOpen(pnm, cnm);
        }
    } else {
      if (domCashe.dom[cnm].prodSelected.includes(pnm)) {
        if (domCashe.dom[cnm].prodSelected.length > 1) {
          bTK.cbDataClose(pnm, cnm);
        } else {
          if (emptyEl != "$blank") {
            bTK.cbDataClose(pnm, cnm);
            bTK.cbOpen(emptyEl, cnm);
          } else {
            domCashe.dom[cnm].prodList[pnm].selfDom.checked = true;
          }
        }
      } else {
        bTK.cbDataOpen(pnm, cnm);
        if (emptyEl != "$blank" && domCashe.dom[cnm].prodSelected.includes(emptyEl)) {
          bTK.cbClose(emptyEl, cnm);
        }
      }
    }
  },  
  cbCheck: function () {
    for (const [cnm, ob] of Object.entries(domCashe.dom)) {
      if (ob.prodType != "checkbox") continue;
      if (ob.emptyEl != "$blank") {
        if (ob.prodSelected.length < 1) {
          bTK.cbOpen(ob.emptyEl, cnm);
        } else if (ob.prodSelected.length > 1 && ob.prodSelected.includes(ob.emptyEl)) {
          bTK.cbClose(ob.emptyEl, cnm);
        }        
      } else if (ob.prodSelected.length < 1) {
        bTK.cbOpen(ob.prodOrder[0], cnm);
      }
    }
  },
  CFGCbBtHandler: [],
  CbBtHandler: function () {
    let evArgs = {
      pnm: this.id,
      cnm: this.parentElement.parentElement.id
    }
    for (const fnc of bTK.CFGCbBtHandler) fnc(evArgs);
  },
  crCbBt: function() {
    for (const cnm of domCashe.domOrder) {
      let ob = domCashe.dom[cnm];
      let tmpList = ob.selfDom.querySelectorAll(".part-checkbox");
      if (!tmpList.length) continue;
      ob.emptyEl = "$blank";
      ob.prodType = "checkbox";
      ob.prodSelected = [],
      ob.prodOrder = [];
      ob.prodList = {};
      for (const pob of tmpList) {
        pob.removeEventListener("change", bTK.CbBtHandler);
        pob.addEventListener("change", bTK.CbBtHandler);
        let dname = pob.id;
        ob.prodOrder.push(dname);
        let cdom = pob.nextElementSibling;
        let erpL = pob.dataset.erp;
        ob.prodList[dname] = {
          "selfDom": pob,
          "cDom": cdom,
          "nmTxt": cdom.querySelector(".part-text-head").textContent,
          "priceVal": Number(cdom.querySelector(".part-price").dataset.priceval),
          "parentCat": cnm,
          "isSelected": pob.checked,
          "value": pob.value,
          "erp": erpL ?? "-"
        }
        if (ob.prodList[dname].value == "0") ob.emptyEl = dname;
        if (ob.prodList[dname].isSelected) ob.prodSelected.push(dname);
      }
    }
    bTK.cbCheck();
    bTK.CFGCbBtHandler.length = 0;
    bTK.CFGCbBtHandler.push(bTK.updateCbState);
  },


  quantUpdate: function(evArgs) {
    let pob = domCashe.dom[evArgs.cnm].prodList[evArgs.pnm];
    if (pob.qType != "dynamic") return;
    if (pob.isSelected) {
      if (pob.qDisabled) {
        pob.qDisabled = false;
        pob.qInput.disabled = false;
      }
      if (pob.qValue<pob.qMin || pob.qValue>pob.qMax) {
        pob.qValue = pob.qMin;
        pob.qInput.value = pob.qMin; 
        pob.qDisplay.textContent = pob.qMin;
      }
      if (pob.qValue==pob.qMin && pob.qSubAv) {
        pob.qSubAv = false;
        pob.qCont.classList.remove("decr-av");
      } else if (pob.qValue>pob.qMin && !pob.qSubAv) {
        pob.qSubAv = true;
        pob.qCont.classList.add("decr-av");
      }
      if (pob.qValue==pob.qMax && pob.qAddAv) {
        pob.qAddAv = false;
        pob.qCont.classList.remove("incr-av");
      } else if (pob.qValue<pob.qMax && !pob.qAddAv) {
        pob.qAddAv = true;
        pob.qCont.classList.add("incr-av");
      }
    } else {
      if (!pob.qDisabled) {
        pob.qDisabled = true;
        pob.qInput.disabled = true;
      }
      if (pob.qValue != 0) {
        pob.qValue = 0;
        pob.qInput.value = 0; 
        pob.qDisplay.textContent = 0;
      }
      if (!pob.qSubAv) {
        pob.qSubAv = false;
        pob.qCont.classList.remove("decr-av");
      }
      if (!pob.qAddAv) {
        pob.qAddAv = false;
        pob.qCont.classList.remove("incr-av");
      }
    }

  },
  quantIncr: function(evArgs) {
    let pob = domCashe.dom[evArgs.cnm].prodList[evArgs.pnm];
    if (pob.qAddAv) {
      pob.qValue++;
      pob.qInput.value = pob.qValue; 
      pob.qDisplay.textContent = pob.qValue; 
    }
    bTK.quantUpdate(evArgs);
  },
  quantDecr: function(evArgs) {
    let pob = domCashe.dom[evArgs.cnm].prodList[evArgs.pnm];
    if (pob.qSubAv) {
      pob.qValue--;
      pob.qInput.value = pob.qValue; 
      pob.qDisplay.textContent = pob.qValue; 
    }
    bTK.quantUpdate(evArgs);
  },
  updateCatQuant: function (evArgs) {
    let ob = domCashe.dom[evArgs.cnm];
    for (const pnm of ob.prodOrder) {
      bTK.quantUpdate({
        "cnm": evArgs.cnm,
        "pnm": pnm
      });
    }
  },  
  CFGquantIncrHandler: [],
  quantIncrHandler: function (e) {
    let pob = this.parentElement.parentElement.previousElementSibling;
    let evArgs = {
      pnm: pob.id,
      cnm: pob.parentElement.parentElement.id
    }
    for (const fnc of bTK.CFGquantIncrHandler) fnc(evArgs);
    e.preventDefault();
  },
  CFGquantDecrHandler: [],
  quantDecrHandler: function(e) {
    let pob = this.parentElement.parentElement.previousElementSibling;
    let evArgs = {
      pnm: pob.id,
      cnm: pob.parentElement.parentElement.id
    }
    for (const fnc of bTK.CFGquantDecrHandler) fnc(evArgs);
    e.preventDefault();
  },
  crQuantity: function() {
    for (const cnm of domCashe.domOrder) {
      let ob = domCashe.dom[cnm];
      if (ob.isEmpty) continue;
      for (const pnm of ob.prodOrder) {
        let pob = ob.prodList[pnm];
        pob.qCont = pob.cDom.querySelector(".part-number-input");
        pob.qInput = pob.qCont.querySelector(".part-quantity");
        pob.qDisabled = pob.qInput.disabled;
        pob.qValue = Number(pob.qInput.value);
        if (pob.qCont.classList.contains("static-number")) {
          pob.qType = "static";
        } else {
          pob.qType = "dynamic";
          pob.qAddAv = pob.qCont.classList.contains("incr-av");
          pob.qSubAv = pob.qCont.classList.contains("decr-av");
          pob.qDisplay = pob.qCont.querySelector(".quantity-display");
          pob.qMin = Number(pob.qInput.min);
          pob.qMax = Number(pob.qInput.max);
  
          let btAdd = pob.qCont.querySelector(".part-num-incr");
          btAdd.removeEventListener("click",bTK.quantIncrHandler);
          btAdd.addEventListener("click",bTK.quantIncrHandler);
          let btSub = pob.qCont.querySelector(".part-num-decr");
          btSub.removeEventListener("click",bTK.quantDecrHandler);
          btSub.addEventListener("click",bTK.quantDecrHandler);
        }
      }
      bTK.updateCatQuant({"cnm":cnm});
    }
    bTK.CFGRdBtHandler.push(bTK.updateCatQuant);
    bTK.CFGCbBtHandler.push(bTK.updateCatQuant);
  
    bTK.CFGquantIncrHandler.length = 0;
    bTK.CFGquantIncrHandler.push(bTK.quantIncr);
    bTK.CFGquantDecrHandler.length = 0;
    bTK.CFGquantDecrHandler.push(bTK.quantDecr);
  }
}




document.addEventListener("DOMContentLoaded", function() {
  bTK.crCats();
  bTK.crRdBt();
  bTK.crCbBt();
  bTK.crQuantity();

  // bTK.crProdPrice();
  // bTK.crHeadSel();
  bTK.crCOpen();  
  
  // crFinalPrice();
  // ~~.crProdNav();
  // ~~.crBuildModal();
  // bTK.setTimeout(crDomReduce, 0);//quick_view.js must run before this. Won't add events otherwise.
  
})