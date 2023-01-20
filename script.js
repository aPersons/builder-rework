/*--------------------------------------------
 Functions to make scroll with speed control
---------------------------------------------*/

// Element or Position to move + Time in ms (milliseconds)

function scrollToQ(element, duration) {
	let e = document.documentElement;
    if (e.scrollTop===0) {
        let t = e.scrollTop;
        ++e.scrollTop;
        e = t+1===e.scrollTop--?e:document.body;
    }
    scrollToC(e, e.scrollTop, element, duration);
}
// Element to move, element or px from, element or px to, time in ms to animate
function scrollToC(element, from, to, duration) {
  if (duration <= 0) return;
  if (typeof from === "object") from=from.offsetTop;
  if (typeof to === "object") to=to.offsetTop;
  // Choose one effect like easeInQuart
  scrollToX(element, from, to, 0, 1/duration, Date.now(), easeInOutCuaic);
}
function scrollToX(element, xFrom, xTo, t01, speed, q, motion) {
  let nq = Date.now();
  let step = nq - q;
  if (t01 < 0 || t01 > 1 || speed <= 0) {
      element.scrollTop = xTo;
      return;
  }
	element.scrollTop = xFrom - (xFrom - xTo) * motion(t01);
	t01 += speed * step;
	
	requestAnimationFrame(() => scrollToX(element, xFrom, xTo, t01, speed, nq, motion));
}
function easeInOutCuaic(t) {
	t/=0.5;
	if(t<1)return t*t*t/2;
	t-=2;
	return (t*t*t+2)/2;
}

/*---------------------------------------------
---------------------------------------------*/



function wtDecimal(wholeNum) {
  let numVal = Number(wholeNum);
  if (!Number.isSafeInteger(numVal)) return "unsupported input";
  let wholeStr = numVal.toString();
  let sl = wholeStr.length;
  if (wholeNum >= 0) {
    if (sl == 0) {
      return "0,00";
    } else if (sl == 1) {
      return `0,0${wholeStr}`;
    } else if (sl == 2) {
      return `0,${wholeStr}`;
    } else {
      return `${wholeStr.slice(0, sl-2)},${wholeStr.slice(sl-2, sl)}`;
    }
  } else {
    if (sl < 2) {
      return "0,00";
    } else if (sl == 2) {
      return `-0,0${wholeStr[1]}`;
    } else if (sl == 3) {
      return `-0,${wholeStr.slice(1, sl)}`;
    } else {
      return `-${wholeStr.slice(1, sl-2)},${wholeStr.slice(sl-2, sl)}`;
    }
  }
}



/*---------------------------------------------
---------------------------------------------*/

let domCashe = {

  dom: {},
  domOrder: [],
  groups: []
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
        "lpState": cDom.classList.contains("lp-show"),
        "collapseDom": cDom.querySelector(".catCollapsible")
      }
    }
  },


  catOpen: function(evArgs) {
    let ob = domCashe.dom[evArgs.cnm];
    if (ob.lpState) return;
    ob.lpState = true;    
    ob.collapseDom.classList.add("collapseTransition");
    requestAnimationFrame(()=>requestAnimationFrame(
      ()=>{
        ob.collapseDom.style.setProperty("--qheight", ob.collapseDom.scrollHeight + "px")
        ob.selfDom.classList.add("lp-show")
      }
      ))
      function openEnd() {
        // scrollToC(element, from, to, duration)
        scrollToC(
          document.documentElement,
          window.scrollY,
          window.scrollY + ob.selfDom.getBoundingClientRect().top - (
            window.innerWidth > 991 ? 149 : window.innerWidth > 767 ? 95 : 125
          ),//125 ~ 95 ~ 149
          200
        )
        ob.collapseDom.classList.remove("collapseTransition");
        this.removeEventListener("transitionend", openEnd);
      }
    ob.collapseDom.addEventListener("transitionend", openEnd);
  },


  catOpenQ: function(evArgs) {
    let ob = domCashe.dom[evArgs.cnm];
    if (ob.lpState) return;
    ob.lpState = true;
    ob.selfDom.classList.add("lp-show");
  },
  catCloseQ: function(evArgs) {
    let ob = domCashe.dom[evArgs.cnm];
    if (!ob.lpState) return;
    ob.lpState = false;
    ob.selfDom.classList.remove("lp-show");
  },


  catClose: function(evArgs) {
    let ob = domCashe.dom[evArgs.cnm];
    if (!ob.lpState) return;
    ob.lpState = false;
    ob.collapseDom.style.setProperty("--qheight", ob.collapseDom.scrollHeight + "px")
    ob.collapseDom.classList.add("collapseTransition");
    requestAnimationFrame(()=>requestAnimationFrame(
      ()=>{
        ob.selfDom.classList.remove("lp-show");
      }
    ))
    function closeEnd() {
      this.classList.remove("collapseTransition");
      this.removeEventListener("transitionend", closeEnd);
    }
    ob.collapseDom.addEventListener("transitionend", closeEnd);
  },


  catAction: function(evArgs) {
    let ob  = domCashe.dom[evArgs.cnm];
    let action = evArgs.action ?? "toggle";

    switch(action) {
      case "open":
        bTK.catOpen(evArgs);
      break;
      case "close":
        bTK.catClose(evArgs);
      break;
      case "same": break;
      default://toggle
        if (ob.lpState) {
          bTK.catClose(evArgs);
        } else {
          bTK.catOpen(evArgs);
        }
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


  groupOpen: function(groupNm) {
    if (domCashe.groups[groupNm].isActive) return;    
    domCashe.groups[groupNm].isActive = true;
    domCashe.groups[groupNm].selfDom.classList.add("group-active");
  },
  
  
  groupClose: function(groupNm) {
    if (!domCashe.groups[groupNm].isActive) return;
    for (cnm of domCashe.groups[groupNm].catList) {
      bTK.catCloseQ({cnm:cnm});
    }    
    domCashe.groups[groupNm].isActive = false;
    domCashe.groups[groupNm].selfDom.classList.remove("group-active");
  },


  groupSelect: function(gList) {
    for (groupNm of domCashe.groupOrder) {
      if (groupNm == "group-default") continue;
      if (gList.includes(groupNm)) {
        bTK.groupOpen(groupNm);
      } else {
        bTK.groupClose(groupNm);
      }
    }
    bTK.groupUpdateHandler();
  },


  CFGgroupUpdateHandler: [],
  groupUpdateHandler: function() {
    for (const fnc of bTK.CFGgroupUpdateHandler) fnc();
  },


  crGroups: function() {
    domCashe.groups = {"group-default": {
      "title": "Default",
      "catList": [],
      "selfDom": null,
      "isActive": true
    }};
    domCashe.groupOrder = ["group-default"];
    for (const cnm of domCashe.domOrder) {
      let qGroup = domCashe.dom[cnm].selfDom.parentElement
      if (qGroup.classList.contains("cat-group")) {
        if (!domCashe.groupOrder.includes(qGroup.id)) {
          domCashe.groupOrder.push(qGroup.id);
          domCashe.groups[qGroup.id] = {
            "title": qGroup.dataset.title,
            "catList": [],
            "selfDom": qGroup,
            "isActive": qGroup.classList.contains("group-active")
          }
        }
        domCashe.groups[qGroup.id].catList.push(cnm);
        domCashe.dom[cnm].group = qGroup.id;
      } else {
        domCashe.groups["group-default"].catList.push(cnm);
        domCashe.dom[cnm].group = "group-default";
      }
    }
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
    let evArgs = {
      pnm: this.id,
      cnm: this.parentElement.parentElement.parentElement.id
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
      cnm: this.parentElement.parentElement.parentElement.id
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
    e.preventDefault();
    let pob = this.parentElement.parentElement.previousElementSibling;
    let evArgs = {
      pnm: pob.id,
      cnm: pob.parentElement.parentElement.parentElement.id
    }
    for (const fnc of bTK.CFGquantIncrHandler) fnc(evArgs);
  },


  CFGquantDecrHandler: [],
  quantDecrHandler: function(e) {
    e.preventDefault();
    let pob = this.parentElement.parentElement.previousElementSibling;
    let evArgs = {
      pnm: pob.id,
      cnm: pob.parentElement.parentElement.parentElement.id
    }
    for (const fnc of bTK.CFGquantDecrHandler) fnc(evArgs);
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
  },


  updateProdPrice: function(evArgs) {
    let ob = domCashe.dom[evArgs.cnm];
    if (ob.prodType == "radio") {
      let sprice = ob.prodList[ob.prodSelected].priceVal;
      for (const pnm of ob.prodOrder) {
        let pob = ob.prodList[pnm];
        if (!pob.hasOwnProperty("priceBlock")) continue;
        if (pnm == ob.prodSelected) {
          // pob.priceBlock.textContent = `${wtDecimal(sprice)}€`;
          continue;
        }
        let dfr = pob.priceVal - sprice;
        if (dfr == 0) {
          pob.priceBlock.textContent = `+0,00€`;
        } else if (dfr < 0) {
          pob.priceBlock.textContent = `${wtDecimal(dfr)}€`;
        } else {
          pob.priceBlock.textContent = `+${wtDecimal(dfr)}€`;
        }
      }
    }
  },


  crProdPrice: function() {
    for (const cnm of domCashe.domOrder) {
      let ob = domCashe.dom[cnm];
      if (ob.prodType == "radio") {
        for (const pnm of ob.prodOrder) {
          let pod = ob.prodList[pnm];
          let fixedPrice = pod.cDom.querySelector(".price-fixed-block");
          if (fixedPrice) fixedPrice.textContent = `${wtDecimal(pod.priceVal)}€`;
          let relPrice = pod.cDom.querySelector(".price-block");
          if (relPrice) pod.priceBlock = relPrice;
        }
        bTK.updateProdPrice({"cnm":cnm});
      } else if (ob.prodType == "checkbox") {
        for (const pnm of ob.prodOrder) {
          let pod = ob.prodList[pnm];
          let fixedPrice = pod.cDom.querySelector(".price-fixed-block");
          if (fixedPrice) fixedPrice.textContent = `${wtDecimal(pod.priceVal)}€`;
          let relPrice = pod.cDom.querySelector(".price-block");
          if (relPrice) relPrice.textContent = `${wtDecimal(pod.priceVal)}€`;
        }
      }
    }
    bTK.CFGRdBtHandler.push(bTK.updateProdPrice);
  },


  updateHeadSel: function(evArgs) {
    let ob = domCashe.dom[evArgs.cnm];
    if (ob.prodType == "radio") {
      if (ob.prodSelected == ob.emptyEl) {
        if (ob.hasSelected) {
          ob.hasSelected = false;
          ob.selfDom.classList.remove("contains-selected");
        }
      } else if (!ob.hasSelected) {
        ob.hasSelected = true;
        ob.selfDom.classList.add("contains-selected");
      }
    } else if (ob.prodType == "checkbox") {
      if (ob.prodSelected.length < 1 || (ob.prodSelected.length < 2 && ob.prodSelected.includes(ob.emptyEl))) {
        if (ob.hasSelected) {
          ob.hasSelected = false;
          ob.selfDom.classList.remove("contains-selected");
        }
      } else if (!ob.hasSelected){
        ob.hasSelected = true;
        ob.selfDom.classList.add("contains-selected");
      }
    }
  },


  crHeadSel: function() {
    for (const cnm of domCashe.domOrder) {
      domCashe.dom[cnm].hasSelected = domCashe.dom[cnm].selfDom.classList.contains("contains-selected");
      bTK.updateHeadSel({"cnm":cnm});
    }
    bTK.CFGRdBtHandler.push(bTK.updateHeadSel);
    bTK.CFGCbBtHandler.push(bTK.updateHeadSel);
  },


  updateCatDetails: function(evArgs) {
    let ob = domCashe.dom[evArgs.cnm];
    if (ob.isEmpty) return;
    if (ob.prodType == "radio") {
      let tEl = document.createElement("div");      
      tEl.classList.add("dt-item");
      let pob = ob.prodList[ob.prodSelected];
      tEl.textContent = pob.nmTxt;
      if (pob.qType == "dynamic") {
        let snippet = document.createElement("strong");
        snippet.textContent = `${pob.qValue}x - `;
        tEl.prepend(snippet);
      }
      ob.dtDom.replaceChildren(tEl);
    } else if (ob.prodType == "checkbox") {
      let lst = [];
      for (const pnm of ob.prodSelected) {
        let tEl = document.createElement("div");        
        tEl.classList.add("dt-item");
        let pob = ob.prodList[pnm];
        tEl.textContent = pob.nmTxt;
        if (pob.qType == "dynamic") {
          let snippet = document.createElement("strong");
          snippet.textContent = `${pob.qValue}x - `;
          tEl.prepend(snippet);
        }
        lst.push(tEl);
      }
      ob.dtDom.replaceChildren(...lst);
    }    
  },


  crCatDetails: function() {
    for (const ob of Object.values(domCashe.dom)) {
      if (!ob.isEmpty) ob.dtDom = ob.selfDom.querySelector(".part-category-details");      
    }
    for (const cnm of domCashe.domOrder) {
      bTK.updateCatDetails({cnm: cnm});
    }
    bTK.CFGRdBtHandler.push(bTK.updateCatDetails);
    bTK.CFGCbBtHandler.push(bTK.updateCatDetails);
    bTK.CFGquantIncrHandler.push(bTK.updateCatDetails);
    bTK.CFGquantDecrHandler.push(bTK.updateCatDetails);
  },
  

  updateCatIMG: function(evArgs) {
    let ob = domCashe.dom[evArgs.cnm];
    if (ob.isEmpty) return;
    if (ob.prodType == "radio") {
      ob.catIMG.src = ob.prodList[ob.prodSelected].imgSrc;
    } else if (ob.prodType == "checkbox") {
      ob.catIMG.src = ob.prodList[ob.prodSelected[0]].imgSrc;
    }
  },


  crCatIMG: function() {
    for (const ob of Object.values(domCashe.dom)) {
      if (ob.isEmpty) continue;
      ob.catIMG = ob.selfDom.querySelector(".part-category-img img");
      for (const pob of Object.values(ob.prodList)) pob.imgSrc = pob.cDom.querySelector(".part-img img").src;
    }
    for (const cnm of domCashe.domOrder) {
      bTK.updateCatIMG({cnm: cnm});
    }
    bTK.CFGRdBtHandler.push(bTK.updateCatIMG);
    bTK.CFGCbBtHandler.push(bTK.updateCatIMG);
  }

}





let build = {

  updateBuildIMG: function(evArgs) {
    if (evArgs.cnm != "cat0") return;
    let ob = domCashe.dom["cat0"];
    if (ob.isEmpty) return;
    if (ob.prodType == "radio") {
      build.bIMG.src = ob.prodList[ob.prodSelected].imgSrc;
    } else if (ob.prodType == "checkbox") {
      build.bIMG.src = ob.prodList[ob.prodSelected[0]].imgSrc;
    }
  },


  crBuilldIMG: function() {
    let imgDom = document.querySelector(".build-img");
    if (!imgDom) return;
    if (!domCashe.dom.hasOwnProperty("cat0")) return;
    build.bIMG = imgDom;
    
    build.updateBuildIMG({cnm: "cat0"});
    bTK.CFGRdBtHandler.push(build.updateBuildIMG);
    bTK.CFGCbBtHandler.push(build.updateBuildIMG);
  }

}





let pr = {

  totalVal: 0,
  priceDom: [],


  updateFinalPrice: function() {
    let nresult = 0;
    for (const ob of Object.values(domCashe.dom)) {
      if (ob.prodType=="radio") {
        let pob = ob.prodList[ob.prodSelected];
        nresult += pob.priceVal * pob.qValue;
      } else if (ob.prodType=="checkbox") {
        for (const pnm of ob.prodSelected) {
          let pob = ob.prodList[pnm];
          nresult += pob.priceVal * pob.qValue;
        }
      }
    }
    if (nresult < 0) nresult = 0;
    if (nresult != pr.totalVal) {
      pr.totalVal = nresult;
      if (pr.priceDom.length) {
        let pricestr = wtDecimal(nresult);
        for (const priceItem of pr.priceDom) {
          priceItem.textContent = pricestr;
        }
      }
      if (domCashe.finalPrice.priceTaxLessDom.length) {
        let pricestr = wtDecimal(Math.floor(nresult / 1.24));
        for (const priceItem of domCashe.finalPrice.priceTaxLessDom) {
          priceItem.textContent = pricestr;
        }
      }
    }
  },


  crFinalPrice: function() {
    domCashe.finalPrice = {}
    let buildPrice = document.querySelectorAll(".build-price-total");
    let buildPriceTaxLess = document.querySelectorAll(".build-price-taxless");
    pr.priceDom = [...buildPrice];
    domCashe.finalPrice.priceTaxLessDom = [...buildPriceTaxLess];
    if (buildPrice.length || buildPriceTaxLess.length) {
      pr.totalVal = 0;
      bTK.CFGRdBtHandler.push(pr.updateFinalPrice);
      bTK.CFGCbBtHandler.push(pr.updateFinalPrice);
      bTK.CFGquantIncrHandler.push(pr.updateFinalPrice);
      bTK.CFGquantDecrHandler.push(pr.updateFinalPrice);
      pr.updateFinalPrice();
    }
  }

}





let nav = {
  
  barMode: false,
  inView: false,


  CFGresizeHadler: [],
  resizeEv: false,
  resizeAv: true,
  resizeHandler: function() {
    if (nav.resizeAv) {
      nav.resizeAv = false;
      for (const fnc of nav.CFGresizeHadler) fnc();
      setTimeout(() => nav.resizeAv = true, 500);
    }
    clearTimeout(nav.resizeEv);
    nav.resizeEv = setTimeout(nav.resizeHandlerEnd,550);
  },


  CFGresizeHadlerEnd: [],
  resizeHandlerEnd: function() {
    nav.resizeAv = false;
    for (const fnc of nav.CFGresizeHadlerEnd) fnc();
    setTimeout(() => nav.resizeAv = true, 500);
  },


  CFGscrollHadler: [],
  scrollEv: false,
  scrollAv: true,
  scrollHandler: function() {
    if (nav.scrollAv) {
      nav.scrollAv = false;
      for (const fnc of nav.CFGscrollHadler) fnc();
      setTimeout(() => nav.scrollAv = true, 50);
      // console.log("scroll event");
    }
    clearTimeout(nav.scrollEv);
    nav.scrollEv = setTimeout(nav.scrollHandlerEnd,55);
  },


  CFGscrollHadlerEnd: [],
  scrollHandlerEnd: function() {
    nav.scrollAv = false;
    for (const fnc of nav.CFGscrollHadlerEnd) fnc();
    setTimeout(() => nav.scrollAv = true, 50);
  },


  updateBarMode: function() {
    if (window.innerWidth >= 768) {
      if (nav.barMode) {
        nav.barMode = false;
      }
    } else {
      if (!nav.barMode) {
        nav.barMode = true;
      }
    }
  },


  updateBarScroll: function() {
    if (!nav.barMode) return
    if (nav.selfDom.parentElement.getBoundingClientRect().top > 110) {
      if (nav.inView) {
        nav.inView = false;
        nav.selfDom.classList.remove("inView");
      }
    } else if (!nav.inView) {
      nav.inView = true;
      nav.selfDom.classList.add("inView");
    }
  },


  updateHasSelected: function(evArgs) {
    let catVal = domCashe.dom[evArgs.cnm].hasSelected;
    if (catVal) {
      if (!nav.navItems[evArgs.cnm].hasSelected) {
        nav.navItems[evArgs.cnm].hasSelected = true;
        nav.navItems[evArgs.cnm].navDom.firstElementChild.classList.replace("text-muted", "text-success");
      }
    } else {
      if (nav.navItems[evArgs.cnm].hasSelected) {
        nav.navItems[evArgs.cnm].hasSelected = false;
        nav.navItems[evArgs.cnm].navDom.firstElementChild.classList.replace("text-success", "text-muted");
      }
    }
  },


  updateLpState: function(evArgs) {
    // let catVal = domCashe.dom[evArgs.cnm].lpState;
    // if (catVal) {
    //   if (!nav.navItems[evArgs.cnm].lpState) {
    //     nav.navItems[evArgs.cnm].lpState = true;
    //     nav.navItems[evArgs.cnm].navDom.classList.add("navlpshow");
    //   }
    // } else {
    //   if (nav.navItems[evArgs.cnm].lpState) {
    //     nav.navItems[evArgs.cnm].lpState = false;
    //     nav.navItems[evArgs.cnm].navDom.classList.remove("navlpshow");
    //   }
    // }
    for (const [cnm, ob] of Object.entries(domCashe.dom)) {
      if (ob.lpState && !nav.navItems[cnm].lpState) {
        nav.navItems[cnm].lpState = true;
        nav.navItems[cnm].navDom.classList.add("navlpshow");
      } else if (!ob.lpState && nav.navItems[cnm].lpState) {
        nav.navItems[cnm].lpState = false;
        nav.navItems[cnm].navDom.classList.remove("navlpshow");
      }
    }
  },

  qFocus: "",
  updateisFocused: function(evArgs) {
    if (!nav.barMode) return;
    let focused = "";
    let rdistance = 0;
    for (const [cnm, ob] of Object.entries(domCashe.dom)) {
      let nhead = ob.selfDom.getBoundingClientRect().top;
      let nfloor = ob.selfDom.getBoundingClientRect().bottom;
      if (nhead < window.innerHeight - 50 && nfloor > 245) {
        if (!focused) {
          focused = cnm
          rdistance = nfloor;
        } else if (nfloor<rdistance) {
          focused = cnm
          rdistance = nfloor;
        }
      }
    }
    for (const [cnm, navob] of Object.entries(nav.navItems)) {
      if (cnm != focused) {
        if (navob.isFocused) {
          navob.isFocused = false;
          navob.navDom.classList.remove("isfocused");
        }
      } else if (!navob.isFocused) {
        navob.isFocused = true;
        navob.navDom.classList.add("isfocused");
        requestAnimationFrame(() => requestAnimationFrame(() => {
          let navbody = nav.selfDom;
          let bpos = navob.navDom.getBoundingClientRect()
          let bleft = bpos.left;
          let bwidth = bpos.width;
          let posOffset = navbody.scrollLeft + bleft-((window.innerWidth-bwidth) / 2);
          navbody.scrollTo({
            left: posOffset,
            behavior: "smooth"
          });
        }))
      }
    }
  },


  CFGnavigatorHandler: [],
  navigatorHandler: function() {
    let evArgs = {
      cnm: this.dataset.navdest
    }
    for (const fnc of nav.CFGnavigatorHandler) fnc(evArgs);
  },


  crNavDom: function() {
    if (!domCashe.domOrder.length) return;
    let selfDom = document.querySelector(".prod-navigation");
    if (!selfDom) return;
    nav.selfDom = selfDom;
    let tmpDom = "";
    let tmpItems = {};
    for (const cnm of domCashe.domOrder) {
      let ob = domCashe.dom[cnm];
      if (ob.isEmpty || ob.isHidden) continue;

      tmpItems[cnm] = {
        "lpState": ob.lpState,
        "hasSelected": ob.hasSelected,
        "isFocused": false
      }

      tmpDom += `<div class="prod-navigator ${ob.lpState?"navlpshow":""}" data-navdest="${cnm}">
      <i class="bi bi-circle-fill fs-xs pe-1 ${ob.hasSelected?"text-success":"text-muted"}"></i>
      <span>${ob.nmTxt}</span>
      </div>`
    }
    if (tmpDom) {
      nav.selfDom.innerHTML = tmpDom;
      nav.navItems = tmpItems;
      for (const obb of nav.selfDom.querySelectorAll(".prod-navigator")) {
        let cnm = obb.dataset.navdest;
        nav.navItems[cnm].navDom = obb;
        obb.removeEventListener("click", nav.navigatorHandler);
        obb.addEventListener("click", nav.navigatorHandler);
      }
    }
    bTK.CFGRdBtHandler.push(nav.updateHasSelected);
    bTK.CFGCbBtHandler.push(nav.updateHasSelected);

    bTK.CFGcHeadHandler.push(nav.updateLpState);
    nav.updateLpState();

    nav.CFGresizeHadlerEnd.push(nav.updateBarMode);
    nav.CFGscrollHadler.push(nav.updateBarScroll);
    nav.updateBarMode();
    nav.updateBarScroll();
    
    nav.CFGscrollHadler.push(nav.updateisFocused);
    nav.updateisFocused();

    nav.CFGnavigatorHandler.push(bTK.catGroupAction);
    nav.CFGnavigatorHandler.push(nav.updateLpState);
  },


  crProdNav: function() {
    document.removeEventListener("scroll", nav.scrollHandler);
    document.addEventListener("scroll", nav.scrollHandler);
    window.removeEventListener("resize", nav.resizeHandler);
    window.addEventListener("resize", nav.resizeHandler);

    nav.CFGresizeHadler.length = 0;
    nav.CFGresizeHadlerEnd.length = 0;
    nav.CFGscrollHadler.length = 0;
    nav.CFGscrollHadlerEnd.length = 0;
    nav.CFGnavigatorHandler.length = 0;

    nav.crNavDom();
  }

}





bModal = {

  updateBuildModal: function(evArgs) {
    let linktext = window.location.href.split('&');
    linktext = `${linktext[0]}&${linktext[1]}&prefill=1`;
    // linktext = `https://www.msystems.gr/section/systems_new/?&system=18&prefill=1`;   //temp change
    let tabletext = `<div class="table-row">
    <div class="modal-cat-header">Κατηγορία</div>
    <div class="modal-prnum-header">Κωδικός</div>
    <div class="modal-product-header">Προϊόν</div>
    <div class="modal-quant-header">Τμχ.</div></div>`;
    let totalVal = 0;
    let isEmpty = true;
    for (let i = 0; i < domCashe.domOrder.length; i++) {
      let ob = domCashe.dom[domCashe.domOrder[i]];
      if (ob.isHidden) continue;
      if (!ob.hasSelected) continue;
      isEmpty = false;
      if (ob.prodType == "radio") {
        let pob = ob.prodList[ob.prodSelected];
        tabletext += `<div class="table-row">
        <div class="cat-nm">${ob.nmTxt}</div>
        <div class="erp-pn">${pob.erp}</div>
        <div class="prod-nm">${pob.nmTxt}</div>
        <div class="prod-quant">${pob.qValue}</div></div>`;
        totalVal+= (pob.qValue * pob.priceVal);
        if (ob.hasSelected) linktext += `&o${i}=${pob.value}&q${i}=${pob.qValue}`;
      } else if (ob.prodType == "checkbox") {
        for (const pnm of ob.prodSelected) {
          let pob = ob.prodList[pnm];
          tabletext += `<div class="table-row">
          <div class="cat-nm">${ob.nmTxt}</div>
          <div class="erp-pn">${pob.erp}</div>
          <div class="prod-nm">${pob.nmTxt}</div>
          <div class="prod-quant">${pob.qValue}</div></div>`;
          totalVal += (pob.qValue * pob.priceVal);
          if (ob.hasSelected) linktext += `&o${i}[]=${pob.value}&q${i}[]=${pob.qValue}`;
        }
      }
    }
    if (isEmpty) tabletext += `<div class="table-row"><div></div><div></div><div>&nbsp;</div><div></div></div>`;
    totalVal = totalVal < 0 ? 0 : totalVal;
    tabletext += `<div class="table-row">
    <div class="modal-total-title">Σύνολο:</div>
    <div></div><div></div><div class="modal-total-num"><span>${wtDecimal(totalVal)}</span> €</div>
    </div>`
    bModal.modalTable.innerHTML = tabletext;
    bModal.linkFull = linktext;
    bModal.qLink = bModal.linkFull;

    // (async () => {
    //   try {  
    //     const request = await fetch(
    //       'https://api-ssl.bitly.com/v4/shorten',{
    //       method: 'POST',
    //       headers: {
    //         'Authorization': `Bearer ${gettoken}`,
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify({ "long_url": bModal.linkFull})
    //     })        
    //     if(request.status >= 400) throw new Error(`Response status: ${request.status}`);
    //     const getjson = await request.json()
    //     bModal.qLink = getjson["link"];
    //   } catch(err) {
    //     console.log(err);
    //   }
    // })()

    bModal.footerLinkBody.textContent = bModal.qLink;
  },
  
  buildShortLink: function(evArgs) {
    try {
      navigator.clipboard.writeText(bModal.qLink);
      bModal.btnCopy.innerHTML = '<i class="bi bi-check2"></i>';
      setTimeout(() => {
        bModal.btnCopy.innerHTML = '<i class="bi bi-paperclip"></i>';      
      },2000)
    } catch {
      bModal.btnCopy.innerHTML = '<i class="bi bi-check2"></i>';
      setTimeout(() => {
        bModal.btnCopy.innerHTML = '<i class="bi bi-x-lg"></i>';      
      },2000)
    }
  },  


  CFGbuildModalOpenHandler: [],
  buildModalOpenHandler: function() {
    let evArgs = {}
    for (const fnc of bModal.CFGbuildModalOpenHandler) fnc(evArgs);
  },
  CFGbuildShortLinkHandler: [],
  buildShortLinkHandler: function() {
    let evArgs = {}
    for (const fnc of bModal.CFGbuildShortLinkHandler) fnc(evArgs);
  },


  crBuildModal: function() {
    let mdl = document.getElementById("build-modal");
    if (!mdl) return;
    let nTitle = document.querySelector('[aria-current="page"]');
    if (nTitle) {
      let ntlDom = mdl.querySelector(".modal-title");
      ntlDom.replaceChildren(ntlDom.childNodes[0], document.createTextNode(nTitle.textContent));
    }
    bModal.modalTable = mdl.querySelector(".modal-body .modal-table");
    bModal.footerLinkBody = mdl.querySelector(".footer-link-body");
    bModal.linkFull = "";
    bModal.btnCopy = mdl.querySelector(".btn-copy-link");
    bModal.btnCopy.removeEventListener("click", bModal.buildShortLinkHandler);
    bModal.btnCopy.addEventListener("click", bModal.buildShortLinkHandler);
  
    let btns = document.querySelectorAll('[data-bs-toggle="modal"][data-bs-target="#build-modal"]');
    for (const btn of btns) {
      btn.removeEventListener("click", bModal.uildModalOpenHandler);
      btn.addEventListener("click", bModal.buildModalOpenHandler);
    }
    bModal.CFGbuildModalOpenHandler.length = 0;
    bModal.CFGbuildModalOpenHandler.push(bModal.updateBuildModal);
  
    bModal.CFGbuildShortLinkHandler.length = 0;
    bModal.CFGbuildShortLinkHandler.push(bModal.buildShortLink);
  }

}





document.addEventListener("DOMContentLoaded", function() {

  bTK.crCats();
  bTK.crGroups();
  bTK.crCOpen();
  bTK.crRdBt();
  bTK.crCbBt();
  bTK.crQuantity();

  bTK.crProdPrice();
  bTK.crHeadSel();
  bTK.crCatDetails();
  bTK.crCatIMG();
  build.crBuilldIMG();
  
  pr.crFinalPrice();
  nav.crProdNav();
  bModal.crBuildModal();
  // bTK.setTimeout(crDomReduce, 0);//quick_view.js must run before this. Won't add events otherwise.
  
})