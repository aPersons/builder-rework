



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
        "isEmpty": (!cDom.querySelectorAll(".part-rd-bt, .part-checkbox").length) ? true : false,
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
      if (!tmpList) continue;
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



  addProdSel: function (pnm, cnm) {
    let qsize = domCashe.dom[cnm].prodSelected.length;
    let sOrd = domCashe.dom[cnm].prodOrder.indexOf(pnm);
    for (let i = 0; i < qsize; i++) {
      let lnm = domCashe.dom[cnm].prodSelected[i];
      if (sOrd<domCashe.dom[cnm].prodOrder.indexOf(lnm)) {
        domCashe.dom[cnm].prodSelected.splice(i, 0, pnm);
        return
      }
    }
    domCashe.dom[cnm].prodSelected.push(pnm);
  },
  removeProdSel: function (pnm, cnm) {
    domCashe.dom[cnm].prodSelected.splice(domCashe.dom[cnm].prodSelected.indexOf(pnm), 1);
  },
  updateCbState: function (evArgs) {
    let pnm = evArgs.pnm;
    let cnm = evArgs.cnm;
    
    if (domCashe.dom[cnm].prodSelected.includes(pnm) && domCashe.dom[cnm].emptyEl == pnm) {
      if (domCashe.dom[cnm].prodSelected.length > 1) {
        removeProdSel(pnm, cnm),
        domCashe.dom[cnm].prodList[pnm].isSelected = false;
      } else {
        domCashe.dom[cnm].prodList[pnm].selfDom.checked = true;
      }
    } else if (domCashe.dom[cnm].prodSelected.includes(pnm)) {
      if (domCashe.dom[cnm].prodSelected.length < 2 && domCashe.dom[cnm].emptyEl == "$blank") {
        domCashe.dom[cnm].prodList[pnm].selfDom.checked = true;
      } else {
        removeProdSel(pnm, cnm);
        domCashe.dom[cnm].prodList[pnm].isSelected = false;
        if (domCashe.dom[cnm].emptyEl != "$blank") {
          let enm = domCashe.dom[cnm].emptyEl;
          if (domCashe.dom[cnm].prodSelected.length < 1) {
            domCashe.dom[cnm].prodSelected = [enm]
            domCashe.dom[cnm].prodList[enm].isSelected = true;
            domCashe.dom[cnm].prodList[enm].selfDom.checked = true;
          } else if (domCashe.dom[cnm].prodSelected.length > 1 && domCashe.dom[cnm].prodSelected.includes(enm)) {
            removeProdSel(enm, cnm);
            domCashe.dom[cnm].prodList[enm].isSelected = false;
            domCashe.dom[cnm].prodList[enm].selfDom.checked = false;
          }
        }
      }
    } else if (domCashe.dom[cnm].emptyEl == pnm) {
      for (const pr of domCashe.dom[cnm].prodSelected) {
        domCashe.dom[cnm].prodList[pr].isSelected = false;
        domCashe.dom[cnm].prodList[pr].selfDom.checked = false;
      }
      domCashe.dom[cnm].prodSelected = [pnm]
      domCashe.dom[cnm].prodList[pnm].isSelected = true;
    } else {
      addProdSel(pnm, cnm);
      domCashe.dom[cnm].prodList[pnm].isSelected = true;
      if (domCashe.dom[cnm].emptyEl != "$blank") {
        if (domCashe.dom[cnm].prodSelected.includes(domCashe.dom[cnm].emptyEl)) {
          let enm = domCashe.dom[cnm].emptyEl;
          removeProdSel(enm, cnm);
          domCashe.dom[cnm].prodList[enm].isSelected = false;
          domCashe.dom[cnm].prodList[enm].selfDom.checked = false;
        }
      }
    }
  },
  CFGCbBtHandler: [],
  CbBtHandler: function () {
    let evArgs = {
      pnm: this.id,
      cnm: this.parentElement.parentElement.parentElement.id
    }
    for (const fnc of CFGCbBtHandler) fnc(evArgs);
  },
  crCbBt: function() {
    for (const cnm of domCashe.domOrder) {
      let ob = domCashe.dom[cnm];
      let tmpList = ob.selfDom.querySelectorAll(".part-checkbox");
      if (!tmpList) continue;
      ob.emptyEl = "$blank";
      ob.prodType = "checkbox";
      ob.prodSelected = [],
      ob.prodOrder = [];
      ob.prodList = {};
      for (const pob of tmpList) {
        pob.removeEventListener("change", CbBtHandler);
        pob.addEventListener("change", CbBtHandler);
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
    CbCheck();
    CFGCbBtHandler.length = 0;
    CFGCbBtHandler.push(updateCbState);
  }
}

document.addEventListener("DOMContentLoaded", function(){
  bTK.crCats();
  bTK.crRdBt();
  bTK.crCbBt();
  // bTK.crQuantity();

  // bTK.crProdPrice();
  // bTK.crFinalPrice();

  bTK.crCOpen();
  // bTK.crHeadSel();

  // bTK.crProdNav();
  // bTK.crBuildModal();
  // bTK.setTimeout(crDomReduce, 0);//quick_view.js must run before this. Won't add events otherwise.
  
})