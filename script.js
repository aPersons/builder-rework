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
      let fntext = `${wholeStr.slice(0, sl-2)},${wholeStr.slice(sl-2, sl)}`;
      let nsl = fntext.length
      if (nsl < 7) {
        return fntext
      } else {
        return `${fntext.slice(0, nsl-6)}.${fntext.slice(nsl-6, nsl)}`
      }
    }
  } else {
    if (sl < 2) {
      return "0,00";
    } else if (sl == 2) {
      return `-0,0${wholeStr[1]}`;
    } else if (sl == 3) {
      return `-0,${wholeStr.slice(1, sl)}`;
    } else {
      let fntext =  `${wholeStr.slice(0, sl-2)},${wholeStr.slice(sl-2, sl)}`;
      let nsl = fntext.length
      if (nsl < 8) {
        return fntext
      } else {
        return `${fntext.slice(0, nsl-6)}.${fntext.slice(nsl-6, nsl)}`
      }
    }
  }
}




/*---------------------------------------------
---------------------------------------------*/

let domCashe = {

  dom: {},
  domOrder: [],
  avCats: [],
}





let bTK = {
  
  crCats: function() {
    domCashe.dom = {};
    domCashe.domOrder = [];
    domCashe.avCats = [];
    let tmpList = document.querySelectorAll(".builder-part-category");
    for (const cDom of tmpList) {
      let tmphead = cDom.querySelector(".part-category-bar");
      let cnm = cDom.id
      domCashe.domOrder.push(cnm);
      domCashe.dom[cnm] = {
        "selfDom": cDom,
        "headDom": tmphead,
        "isHidden": cDom.classList.contains("d-none"),
        "isEmpty": !cDom.querySelectorAll(".part-list-container > input").length,
        "pListDom": cDom.querySelector(".part-list-container"),
        "nmTxt": tmphead.textContent,
        "lpState": cDom.classList.contains("lp-show"),
        "collapseDom": cDom.querySelector(".catCollapsible")
      }
      if (!domCashe.dom[cnm].isEmpty && !domCashe.dom[cnm].isHidden) {
        domCashe.avCats.push([cnm, domCashe.dom[cnm]])
      }
    }
  },


  catOpen: function(evArgs) {
    let ob = domCashe.dom[evArgs.cnm];
    if (ob.lpState) {
      scrollToC(
        document.documentElement,
        window.scrollY,
        // window.scrollY + ob.selfDom.getBoundingClientRect().top - (
        //   window.innerWidth > 991 ? 149 : window.innerWidth > 767 ? 95 : 125
        // ),//125 ~ 95 ~ 149
        window.scrollY + ob.selfDom.getBoundingClientRect().top - (window.innerWidth > 991 ? 95 : 125),//125 ~ 95 ~ 149
        200
      )
      return
    }
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
        // window.scrollY + ob.selfDom.getBoundingClientRect().top - (
        //   window.innerWidth > 991 ? 149 : window.innerWidth > 767 ? 95 : 125
        // ),//125 ~ 95 ~ 149
        window.scrollY + ob.selfDom.getBoundingClientRect().top - (window.innerWidth > 991 ? 95 : 125),//125 ~ 95 ~ 149
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
    for (const [cnm,] of domCashe.avCats) {
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
    for (const [, ob] of domCashe.avCats) {
      ob.headDom.removeEventListener("click", bTK.cHeadHandler);
      ob.headDom.addEventListener("click", bTK.cHeadHandler);  
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
    for (const [, ob] of domCashe.avCats) {
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
    for (const [cnm, ob] of domCashe.avCats) {
      let tmpList = ob.selfDom.querySelectorAll(".part-rd-bt");
      if (!tmpList.length) continue;
      ob.prodType = "radio";
      ob.emptyEl = "$blank";
      ob.prodList = {};
      ob.prodOrder = [];
      ob.avProds = [];
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
          "nmTxt": new Array([],...cdom.querySelector(".part-text-head").childNodes).reduce((a, b) => {
            if (b.nodeType === Node.TEXT_NODE){
              a.push(b.data);
            } else if (b.classList.contains("badge")) {
              a.push(b.outerHTML);
            }
            return a
          }).join(" "),
          "priceVal": Number(cdom.querySelector(".part-price").dataset.priceval),
          "parentCat": cnm,
          "isSelected": pob.checked,
          "value": pob.value,
          "erp": erpL ?? "-"
        }
        if (ob.prodList[dname].value == "0") ob.emptyEl = dname;
        if (ob.prodList[dname].isSelected) ob.prodSelected = dname;

        ob.avProds.push([dname, ob.prodList[dname]]);
      }
    }
    bTK.rdSelCheck();
    bTK.CFGRdBtHandler.length = 0;
    bTK.CFGRdBtHandler.push(bTK.updateRdState);
  },


  cbDataOpen: function(pnm, cnm) {
    let ob = domCashe.dom[cnm];
    ob.prodList[pnm].isSelected = true;
    let qsize = ob.prodSelected.length;
    let sOrd = ob.prodOrder.indexOf(pnm);
    for (let i = 0; i < qsize; i++) {
      let lnm = ob.prodSelected[i];
      if (sOrd < ob.prodOrder.indexOf(lnm)) {
        ob.prodSelected.splice(i, 0, pnm);
        return;
      }
    }
    domCashe.dom[cnm].prodSelected.push(pnm);     
  },
  cbDataClose: function(pnm, cnm) {
    let ob = domCashe.dom[cnm];
    ob.prodList[pnm].isSelected = false;
    ob.prodSelected.splice(ob.prodSelected.indexOf(pnm), 1);      
  },
  cbOpen: function(pnm, cnm) {
    let pob = domCashe.dom[cnm].prodList[pnm];
    if (!pob.isSelected) {
      pob.selfDom.checked = true;
      bTK.cbDataOpen(pnm, cnm);
    }
  },
  cbClose: function(pnm, cnm) {
    let pob = domCashe.dom[cnm].prodList[pnm];
    if (pob.isSelected) {
      pob.selfDom.checked = false;
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
    let ob = domCashe.dom[cnm];
    let emptyEl = ob.emptyEl;

    if (pnm == emptyEl) {
      if (ob.prodSelected.includes(pnm)) {
        if (ob.prodSelected.length > 1) {
          bTK.cbDataClose(pnm, cnm);
        } else {
          ob.prodList[pnm].selfDom.checked = true;
        }
      } else {
        let lCopy = [...ob.prodSelected];
        for (const pr of lCopy) {
          bTK.cbClose(pr, cnm);
        }
        bTK.cbDataOpen(pnm, cnm);
        }
    } else {
      if (ob.prodSelected.includes(pnm)) {
        if (ob.prodSelected.length > 1) {
          bTK.cbDataClose(pnm, cnm);
        } else {
          if (emptyEl != "$blank") {
            bTK.cbDataClose(pnm, cnm);
            bTK.cbOpen(emptyEl, cnm);
          } else {
            ob.prodList[pnm].selfDom.checked = true;
          }
        }
      } else {
        bTK.cbDataOpen(pnm, cnm);
        if (emptyEl != "$blank" && ob.prodSelected.includes(emptyEl)) {
          bTK.cbClose(emptyEl, cnm);
        }
      }
    }
  },
  
  
  cbCheck: function () {
    for (const [cnm, ob] of domCashe.avCats) {
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
    for (const [cnm, ob] of domCashe.avCats) {
      let tmpList = ob.selfDom.querySelectorAll(".part-checkbox");
      if (!tmpList.length) continue;
      ob.emptyEl = "$blank";
      ob.prodType = "checkbox";
      ob.prodSelected = [],
      ob.prodOrder = [];
      ob.prodList = {};
      ob.avProds = [];
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
          "nmTxt": new Array([],...cdom.querySelector(".part-text-head").childNodes).reduce((a, b) => {
            if (b.nodeType === Node.TEXT_NODE){
              a.push(b.data);
            } else if (b.classList.contains("badge")) {
              a.push(b.outerHTML);
            }
            return a
          }).join(" "),
          "priceVal": Number(cdom.querySelector(".part-price").dataset.priceval),
          "parentCat": cnm,
          "isSelected": pob.checked,
          "value": pob.value,
          "erp": erpL ?? "-"
        }
        if (ob.prodList[dname].value == "0") ob.emptyEl = dname;
        if (ob.prodList[dname].isSelected) ob.prodSelected.push(dname);

        ob.avProds.push([dname, ob.prodList[dname]]);
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
      if (pob.qValue < pob.qMin || pob.qValue > pob.qMax || (pob.qValue - pob.qMin) % pob.qstep != 0 ) {
        pob.qValue = pob.qMin;
        pob.qInput.value = pob.qMin; 
        pob.qDisplay.textContent = pob.qMin;
      }
      if (pob.qValue < (pob.qMin + pob.qstep)) {
        if (pob.qSubAv) {
          pob.qSubAv = false;
          pob.qCont.classList.remove("decr-av");
        }
      } else {
        if (!pob.qSubAv) {
          pob.qSubAv = true;
          pob.qCont.classList.add("decr-av");
        }
      }
      if (pob.qValue > (pob.qMax - pob.qstep)) {
        if (pob.qAddAv) {
          pob.qAddAv = false;
          pob.qCont.classList.remove("incr-av");
        }
      } else {
        if (!pob.qAddAv) {
          pob.qAddAv = true;
          pob.qCont.classList.add("incr-av");
        }
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
      pob.qValue += pob.qstep;
      pob.qInput.value = pob.qValue; 
      pob.qDisplay.textContent = pob.qValue; 
    }
    bTK.quantUpdate(evArgs);
  },


  quantDecr: function(evArgs) {
    let pob = domCashe.dom[evArgs.cnm].prodList[evArgs.pnm];
    if (pob.qSubAv) {
      pob.qValue -= pob.qstep;
      pob.qInput.value = pob.qValue; 
      pob.qDisplay.textContent = pob.qValue; 
    }
    bTK.quantUpdate(evArgs);
  },


  updateCatQuant: function (evArgs) {
    for (const [pnm,] of domCashe.dom[evArgs.cnm].avProds) {
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
    for (const [cnm, ob] of domCashe.avCats) {
      for (const [, pob] of ob.avProds) {
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
          pob.qstep = Number(pob.qInput.step);
  
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
      for (const [pnm, pob] of ob.avProds) {
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
    for (const [cnm, ob] of domCashe.avCats) {
      if (ob.prodType == "radio") {
        for (const [, pob] of ob.avProds) {
          let fixedPrice = pob.cDom.querySelector(".price-fixed-block");
          if (fixedPrice) fixedPrice.textContent = `${wtDecimal(pob.priceVal)}€`;
          let relPrice = pob.cDom.querySelector(".price-block");
          if (relPrice) pob.priceBlock = relPrice;
        }
        bTK.updateProdPrice({"cnm":cnm});
      } else if (ob.prodType == "checkbox") {
        for (const [, pob] of ob.avProds) {
          let fixedPrice = pob.cDom.querySelector(".price-fixed-block");
          if (fixedPrice) fixedPrice.textContent = `${wtDecimal(pob.priceVal)}€`;
          let relPrice = pob.cDom.querySelector(".price-block");
          if (relPrice) relPrice.textContent = `${wtDecimal(pob.priceVal)}€`;
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
    for (const [cnm, ob] of domCashe.avCats) {
      if (ob.isEmpty || ob.isHidden) continue;
      ob.hasSelected = ob.selfDom.classList.contains("contains-selected");
      bTK.updateHeadSel({"cnm":cnm});
    }
    bTK.CFGRdBtHandler.push(bTK.updateHeadSel);
    bTK.CFGCbBtHandler.push(bTK.updateHeadSel);
  },


  updateCatDetails: function(evArgs) {
    let ob = domCashe.dom[evArgs.cnm];
    if (ob.prodType == "radio") {
      let tEl = document.createElement("div");      
      tEl.classList.add("dt-item");
      let pob = ob.prodList[ob.prodSelected];
      tEl.innerHTML = pob.nmTxt;
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
        tEl.innerHTML = pob.nmTxt;
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
    for (const [, ob] of domCashe.avCats) {
      ob.dtDom = ob.selfDom.querySelector(".part-category-details");      
    }
    for (const [cnm,] of domCashe.avCats) {
      bTK.updateCatDetails({cnm: cnm});
    }
    bTK.CFGRdBtHandler.push(bTK.updateCatDetails);
    bTK.CFGCbBtHandler.push(bTK.updateCatDetails);
    bTK.CFGquantIncrHandler.push(bTK.updateCatDetails);
    bTK.CFGquantDecrHandler.push(bTK.updateCatDetails);
  },
  

  updateCatIMG: function(evArgs) {
    let ob = domCashe.dom[evArgs.cnm];
    if (ob.prodType == "radio") {
      ob.catIMG.src = ob.prodList[ob.prodSelected].imgSrc;
    } else if (ob.prodType == "checkbox") {
      ob.catIMG.src = ob.prodList[ob.prodSelected[0]].imgSrc;
    }
  },


  crCatIMG: function() {
    for (const [, ob] of domCashe.avCats) {
      ob.catIMG = ob.selfDom.querySelector(".part-category-img img");
      for (const [, pob] of ob.avProds) pob.imgSrc = pob.cDom.querySelector(".part-img img").src;
    }
    for (const [cnm,] of domCashe.avCats) {
      bTK.updateCatIMG({cnm: cnm});
    }
    bTK.CFGRdBtHandler.push(bTK.updateCatIMG);
    bTK.CFGCbBtHandler.push(bTK.updateCatIMG);
  }

}





let build = {

  async getAltIMG(pnm, pob) {
    try {
      let p_id = new FormData();
      p_id.append("product_id", pob.value);        
      const pre_request = await fetch(
        'https://www.msystems.gr/google/sysphotos.php', {
        method: 'POST',
        body: p_id
      })
      const jsn = await pre_request.json();

      if (jsn.success && jsn.found) {
        const request = await fetch(
          `https://static.msystems.gr/photos/big_photos/${pob.value}.sys.jpg`
        )
        if(request.status >= 300) {
          pob.imgAlt = false;
        } else {
          const getimg = await request.blob();
          pob.imgAlt = [URL.createObjectURL(getimg), getimg];
    
          let ob = domCashe.dom["cat0"];
    
          if (ob.prodType == "radio") {
            if (ob.prodSelected == pnm) build.bIMG.src = pob.imgAlt[0];
          } else if (ob.prodType == "checkbox") {
            if (ob.prodSelected[0] == pnm) build.bIMG.src = pob.imgAlt[0];
          }
        }
      }
    } catch(err) {
      pob.imgAlt = false;
    }
  },


  updateBuildIMG: function(evArgs) {
    if (evArgs.cnm != "cat0") return;
    let ob = domCashe.dom["cat0"];
    if (ob.prodType == "radio") {
      if (ob.prodList[ob.prodSelected].imgAlt) {
        build.bIMG.src = ob.prodList[ob.prodSelected].imgAlt[0];
      } else {
        build.bIMG.src = ob.prodList[ob.prodSelected].imgSrc.replace("/cat_thumbs/", "/big_photos/");
      }
    } else if (ob.prodType == "checkbox") {
      if (ob.prodList[ob.prodSelected[0]].imgAlt) {
        build.bIMG.src = ob.prodList[ob.prodSelected[0]].imgAlt[0];
      } else {
        build.bIMG.src = ob.prodList[ob.prodSelected[0]].imgSrc.replace("/cat_thumbs/", "/big_photos/");
      }
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
    
    for (const [pnm, pob] of Object.entries(domCashe.dom["cat0"].prodList)) build.getAltIMG(pnm, pob);
       
  }

}





let pr = {

  totalVal: 0,
  priceDom: [],


  updateFinalPrice: function() {
    let nresult = 0;
    for (const [, ob] of domCashe.avCats) {
      if (ob.prodType == "radio") {
        let pob = ob.prodList[ob.prodSelected];
        nresult += pob.priceVal * pob.qValue;
      } else if (ob.prodType == "checkbox") {
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
    if (window.innerWidth > 991) {
      if (nav.barMode) {
        nav.barMode = false;
        nav.updateBarScroll();
        nav.updateisFocused();
      }
    } else {
      if (!nav.barMode) {
        nav.barMode = true;
        nav.updateBarScroll();
        nav.updateisFocused();
      }
    }
  },


  updateBarScroll: function() {
    if (!nav.barMode) {
      if (nav.inView) {
        nav.inView = false;
        nav.selfDom.classList.remove("inView");
      }
    } else if (nav.selfDom.parentElement.getBoundingClientRect().top > 110) {
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
    for (const [cnm, ob] of domCashe.avCats) {
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
    for (const [cnm, ob] of domCashe.avCats) {
      let nhead = ob.selfDom.getBoundingClientRect().top;
      let nfloor = ob.selfDom.getBoundingClientRect().bottom;
      if (nhead < window.innerHeight && nfloor > 122) {
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
      cnm: this.dataset.navdest,
      action: "open"
    }
    for (const fnc of nav.CFGnavigatorHandler) fnc(evArgs);
  },


  CFGnavGroupHandler: [],
  navGroupHandler: function() {
    let evArgs = {
      cnm: this.dataset.navdest
    }
    for (const fnc of nav.CFGnavGroupHandler) fnc(evArgs);
  },


  crNavDom: function() {
    if (!domCashe.avCats.length) return;
    let selfDom = document.querySelector(".prod-navigation");
    if (!selfDom) return;
    nav.selfDom = selfDom;
    let tmpDom = "";
    let tmpItems = {};
    for (const [cnm, ob] of domCashe.avCats) {

      tmpItems[cnm] = {
        "lpState": ob.lpState,
        "hasSelected": ob.hasSelected,
        "isFocused": false
      }

      tmpDom += `<div class="prod-navigator ${ob.lpState?"navlpshow":""}" data-navdest="${cnm}">
      <i class="bi ${ob.prodType === "radio"?"bi-circle-fill":"bi-square-fill"} fs-xs pe-1 ${ob.hasSelected?"text-success":"text-muted"}"></i>
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
    nav.CFGnavGroupHandler.length = 0;

    nav.crNavDom();
  }

}





let buildSummary = {

  sumDom: false,


  catList: [
    ["Barebone", false],
    ["Επεξεργαστής", false],
    ["Μητρική", false],
    ["Κάρτα Γραφικών", false],
    ["Μνήμη RAM", false],
    ["Δίσκος SSD M.2", false],
    ["Λειτουργικό Σύστημα", false],
  ],


  domList: {},

  
  sumUpdate: function(evArgs) {
    if (!buildSummary.domList.hasOwnProperty(evArgs.cnm)) return;
    let ob = domCashe.dom[evArgs.cnm];
    if (ob.prodType == "radio") {
      let pItem = document.createElement("LI");
      pItem.classList.add("fs-sm");
      let sp = ob.prodList[ob.prodSelected];
      pItem.innerHTML = (sp.qValue > 1? `${sp.qValue}x - ` :"") +  sp.nmTxt;
      buildSummary.domList[evArgs.cnm][1].replaceChildren(pItem);
    } else if (ob.prodType == "checkbox") {
      pList = []
      for (pnm of ob.prodSelected) {
        let pItem = document.createElement("LI");
        pItem.classList.add("fs-sm");
        let sp = ob.prodList[pnm];
        pItem.innerHTML = (sp.qValue > 1? `${sp.qValue}x - ` :"") +  sp.nmTxt;
        pList.push(pItem);
      }
      buildSummary.domList[evArgs.cnm][1].replaceChildren(...pList);
    }
  },

  
  crSummary: function() {
    let sumElement = document.querySelector(".build-summary");
    if (sumElement) buildSummary.sumDom = sumElement;
    else return;
    if (!domCashe.avCats.length) return;

    elList = [];

    for (const [i, [nmTxt,]] of buildSummary.catList.entries()) {
      for (const [cnm, ob] of domCashe.avCats) {
        if (nmTxt === ob.nmTxt) {
          buildSummary.catList[i][1] = cnm;
          let catEl = document.createElement("LI");
          catEl.classList.add("sumcat");

          let nmChild = document.createElement("SPAN");
          nmChild.classList.add("text-muted", "fs-sm");
          nmChild.textContent = ob.nmTxt;
          let childItems = document.createElement("UL");

          catEl.replaceChildren(nmChild, childItems);

          buildSummary.domList[cnm] = [catEl, childItems];
          elList.push(catEl);
          break;
        }
      }
    }

    for (const [,cnm] of buildSummary.catList) {
      buildSummary.sumUpdate({cnm:cnm});
    }
    
    sumElement.replaceChildren(...elList);

    bTK.CFGRdBtHandler.push(buildSummary.sumUpdate);
    bTK.CFGCbBtHandler.push(buildSummary.sumUpdate);
    bTK.CFGquantIncrHandler.push(buildSummary.sumUpdate);
    bTK.CFGquantDecrHandler.push(buildSummary.sumUpdate);
  }

}





let bModal = {

  updateBuildModal: function(evArgs) {
    let linktext = window.location.href.split('&');
    linktext = `${linktext[0]}&${linktext[1]}&prefill=1`;
    // linktext = `https://www.msystems.gr/section/systems_new/?&system=18&prefill=1`;   //temp change
    let tabletext = `<div class="table-row">
    <div class="modal-cat-header">Κατηγορία</div>
    <div class="modal-product-header">Προϊόν</div>
    <div class="modal-quant-header">Τμχ.</div></div>`;
    let totalVal = 0;
    let isEmpty = true;
    for (let i = 0; i < domCashe.domOrder.length; i++) {
      let ob = domCashe.dom[domCashe.domOrder[i]];
      if (ob.isHidden || ob.isEmpty) continue;
      if (!ob.hasSelected) continue;
      isEmpty = false;
      if (ob.prodType == "radio") {
        let pob = ob.prodList[ob.prodSelected];
        tabletext += `<div class="table-row">
        <div class="cat-nm">${ob.nmTxt}</div>
        <div class="prod-nm">${pob.nmTxt}</div>
        <div class="prod-quant">${pob.qValue}</div></div>`;
        totalVal+= (pob.qValue * pob.priceVal);
        if (ob.hasSelected) linktext += `&o${i}=${pob.value}&q${i}=${pob.qValue}`;
      } else if (ob.prodType == "checkbox") {
        for (const pnm of ob.prodSelected) {
          let pob = ob.prodList[pnm];
          tabletext += `<div class="table-row">
          <div class="cat-nm">${ob.nmTxt}</div>
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
    <div></div><div class="modal-total-num"><span>${wtDecimal(totalVal)}</span> €</div>
    </div>`
    bModal.modalTable.innerHTML = tabletext;
    bModal.linkFull = linktext;
    bModal.qLink = bModal.linkFull;

    // (async () => {
    //   try {
    //     let lurl = new FormData();
    //     lurl.append("lurl", bModal.linkFull);
    //     const request = await fetch(
    //       'https://www.msystems.gr/google/surl.php',{
    //       method: 'POST',
    //       body: lurl
    //     })        
    //     if(request.status >= 400) throw new Error(`Response status: ${request.status}`);
    //     const getjson = await request.json()
    //     bModal.qLink = `www.msystems.gr/surl/${getjson["surl"]}`;
    //     bModal.footerLinkBody.textContent = bModal.qLink;
    //   } catch(err) {
    //     console.log(err);
    //   }
    // })()

    bModal.footerLinkBody.textContent = bModal.qLink;
  },
  
  buildShortLink: function(evArgs) {
    try {
      navigator.clipboard.writeText(bModal.qLink);
      bModal.btnCopy.innerHTML = '<i class="bi bi-check2"></i> Αντιγραφή';
      setTimeout(() => {
        bModal.btnCopy.innerHTML = '<i class="bi bi-paperclip"></i> Αντιγραφή';  
      },2000)
    } catch {
      bModal.btnCopy.innerHTML = '<i class="bi bi-x-lg"></i> Αντιγραφή';
      setTimeout(() => {
        bModal.btnCopy.innerHTML = '<i class="bi bi-paperclip"></i> Αντιγραφή';  
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
    bModal.footerLinkBody = mdl.querySelector(".footer-link-body .link-txt");
    bModal.qLink = bModal.linkFull = document.URL;
    bModal.btnCopy = mdl.querySelector(".btn-copy-link");
    bModal.btnCopy.removeEventListener("click", bModal.buildShortLinkHandler);
    bModal.btnCopy.addEventListener("click", bModal.buildShortLinkHandler);
  
    let btns = document.querySelectorAll('[data-bs-toggle="modal"][data-bs-target="#build-modal"]');
    for (const btn of btns) {
      btn.removeEventListener("click", bModal.buildModalOpenHandler);
      btn.addEventListener("click", bModal.buildModalOpenHandler);
    }
    bModal.CFGbuildModalOpenHandler.length = 0;
    bModal.CFGbuildModalOpenHandler.push(bModal.updateBuildModal);
  
    bModal.CFGbuildShortLinkHandler.length = 0;
    bModal.CFGbuildShortLinkHandler.push(bModal.buildShortLink);
  }

}



let perfKit = {

  gameData: {},
  qCPU: false,
  qGPU: false,
  gameScore: false,


  CFGdataUpdate: [],
  dataUpdateHandler: function() {
    for (const fnc of perfKit.CFGdataUpdate) fnc({});
  },

  perfDataUpdate: function (evArgs) {
    if (perfKit.qCPU == domCashe.dom["cat2"].prodSelected && perfKit.qGPU == domCashe.dom["cat5"].prodSelected) return;
    perfKit.qCPU = domCashe.dom["cat2"].prodSelected;
    perfKit.qGPU = domCashe.dom["cat5"].prodSelected;
    (async function() {
      try {
        let cpuNM = domCashe.dom["cat2"].prodList[perfKit.qCPU].cpuNM;
        let gpuNM = domCashe.dom["cat5"].prodList[perfKit.qGPU].gpuNM;
        // if (!cpu || !gpu) throw new Error(`Incorect CPU/GPU Key: {"cpu":"${cpuNM}","gpu":"${gpuNM}"}`)
        // const request = await fetch(
        //   'https://www.msystems.gr/api/gameperf.php',{
        //   method: 'POST',
        //   body: `{"cpu":"${cpuNM}","gpu":"${gpuNM}"}`
        // })
        // let perfJSON = await request.json();
        // if (perfJSON["result"] != "success") throw new Error("Bad Result");
        
        let perfJSON = {
          "cpu"   : "4698-419",
          "gpu"   : "5063",
          "lol1"  : 1, "lol2"  : 1, "lol3"  : 1, "lol4"  : 1, "lol5"  : 1, "lol6"  : 1,
          "val1"  : 1, "val2"  : 1, "val3"  : 1, "val4"  : 1, "val5"  : 1, "val6"  : 1,
          "gtav1" : 1, "gtav2" : 1, "gtav3" : 1, "gtav4" : 1, "gtav5" : 1, "gtav6" : 0,
          "fort1" : 1, "fort2" : 1, "fort3" : 1, "fort4" : 1, "fort5" : 1, "fort6" : 1,
          "csgo1" : 1, "csgo2" : 1, "csgo3" : 1, "csgo4" : 1, "csgo5" : 1, "csgo6" : 1,
          "codwz1": 1, "codwz2": 1, "codwz3": 1, "codwz4": 1, "codwz5": 1, "codwz6": 0,
          "hogl1" : 1, "hogl2" : 0, "hogl3" : 1, "hogl4" : 0, "hogl5" : 1, "hogl6" : 0,
          "gaming": 86,
          "result": "success"
        }



        perfKit.gameScore = perfJSON["gaming"];
        for (const [gnm,gob] of Object.entries(perfKit.gameData)) {
          if (gob.hasOwnProperty["1080_60"]) {
            gob["1080_60"] = perfJSON[`${gnm}1`] == 1 ? true : false;
          }
          if (gob.hasOwnProperty["1080_144"]) {
            gob["1080_144"] = perfJSON[`${gnm}2`] == 1 ? true : false;
          }
          if (gob.hasOwnProperty["1440_60"]) {
            gob["1440_60"] = perfJSON[`${gnm}3`] == 1 ? true : false;
          }
          if (gob.hasOwnProperty["1440_144"]) {
            gob["1440_144"] = perfJSON[`${gnm}4`] == 1 ? true : false;
          }
          if (gob.hasOwnProperty["4k_60"]) {
            gob["4k_60"] = perfJSON[`${gnm}5`] == 1 ? true : false;
          }
          if (gob.hasOwnProperty["4k_144"]) {
            gob["4k_144"] = perfJSON[`${gnm}6`] == 1 ? true : false;
          }
        }
      } catch (er){
        console.log(er);
        for (const gob of Object.values(perfKit.gameData)) {
          for (const confnm of Object.keys(gob)) {
            gob[confnm] = false;
          }
        }
        perfKit.dataUpdateHandler();
      }
    })()
  },

  kitMain: {
    gameSelectUpdate: function (evArgs) {
      let qGame = evArgs?.gameSelect ?? false;
      if (qGame) {
        if (qGame != perfKit.kitMain.gameSelected) {
          perfKit.kitMain.gameSelected = qGame;
          perfKit.kitMain.perfDrawUpdate();
        }
      } else {
        qGame = perfKit.kitMain.gameSelected;
      }
      for (const [gnm, gob] of Object.entries(perfKit.kitMain.gameItems)) {
        if (gnm == qGame && !gob.gameSelected) {
          gob.gameSelected = true;
          gob.selfDom.classList.add("gameSelected");
          gob.titleDom.classList.add("gameSelected");
          gob.imgDom.classList.add("gameSelected");
          gob.imgDom_vertical.classList.add("gameSelected");
        } else if (gnm != qGame && gob.gameSelected) {
          gob.gameSelected = false;
          gob.selfDom.classList.remove("gameSelected");
          gob.titleDom.classList.remove("gameSelected");
          gob.imgDom.classList.remove("gameSelected");
          gob.imgDom_vertical.classList.remove("gameSelected");
        }
      }

    },
    perfDrawUpdate: function (evArgs) {
      let mperf = domCashe.dom["cat2"].prodList[domCashe.dom["cat2"].prodSelected].cpuPerf;
      if (perfKit.kitMain.barMultimedia != mperf) {
        if (mperf === false) {
          perfKit.kitMain.barMultimedia = 0;
          perfKit.kitMain.barMultimediaDom.style.width = 0;
        } else {
          perfKit.kitMain.barMultimedia = mperf;
          perfKit.kitMain.barMultimediaDom.style.width = mperf;
        }
      }
      let gperf = perfKit.gameScore;
      if (perfKit.kitMain.barGame != gperf) {
        if (gperf === false) {
          perfKit.kitMain.barGame = 0;
          perfKit.kitMain.barGameDom.style.width = 0;
        } else {
          perfKit.kitMain.barGame = gperf;
          perfKit.kitMain.barGameDom.style.width = gperf;
        }
      }
      for ( const [bnm, bob] of Object.entries(perfKit.kitMain.perfBadges)) {
        let bValnew = perfKit.gameData[perfKit.kitMain.gameSelected][bnm];
        if (bob.status != bValnew) {
          if (bValnew) {
            bob.selfDom.classList.add("text-success");
          } else {
            bob.selfDom.classList.remove("text-success");
          }
          bob.status = bValnew;
        }
      }
    },

    CFGkitMainBtHandler: [],
    kitMainBtHandler: function() {
    let evArgs = {
      gameSelect: this.dataset.gamenm
    }
    for (const fnc of perfKit.kitMain.CFGkitMainBtHandler) fnc(evArgs);
    },
    selfDom: false,
    
    barMultimediaDom: false,
    barMultimedia: false,
    barGameDom: false,
    barGame: false,
    
    perfBadges: {},
    gameItems: {},
    gameSelected: false
  },




  crPerfKit: function() {
    let kitMainDom = document.querySelector(".perfKitMain");
    if (!kitMainDom) return;

    for (const [ ,pob] of domCashe.dom["cat2"].avProds) {
      pob.cpuNM = pob.selfDom.dataset.cpu ?? false;
      pob.cpuPerf = pob.selfDom.dataset.cpuperf ?? false;
    }
    for (const [ ,pob] of domCashe.dom["cat5"].avProds) {
      pob.gpuNM = pob.selfDom.dataset.gpu ?? false;
    }

    perfKit.kitMain.selfDom = kitMainDom;
    perfKit.kitMain.barMultimediaDom = kitMainDom.querySelector(".perfBar-multimedia") ?? false;
    perfKit.kitMain.barGameDom = kitMainDom.querySelector(".perfBar-game") ?? false;

    let badgeList = kitMainDom.querySelectorAll(".perfBadge");
    for (const badge of badgeList) {
      perfKit.kitMain.perfBadges[badge.dataset.perfconfig] = {
        selfDom: badge,
        status: false
      }
    }
    let gameBtList = kitMainDom.querySelectorAll(".gameSelect");
    for (const bt of gameBtList) {
      let btnm = bt.dataset.gamenm;
      perfKit.kitMain.gameItems[btnm] = {
        selfDom: bt,
        gameSelected: false
      }
      if (!perfKit.kitMain.gameSelected && bt.classList.contains("gameSelected")) {
        perfKit.kitMain.gameSelected = btnm;
      }
      bt.removeEventListener("click", perfKit.kitMain.kitMainBtHandler);
      bt.addEventListener("click", perfKit.kitMain.kitMainBtHandler);
    }
    if (!perfKit.kitMain.gameSelected) perfKit.kitMain.gameSelected = Object.keys(perfKit.kitMain.gameItems)[0];    

    let gameTitle = kitMainDom.querySelectorAll(".gameTitle h6");
    for (const title of gameTitle) {
      perfKit.kitMain.gameItems[title.dataset.gamenm]["titleDom"] = title;
    }
    let gameBg = kitMainDom.querySelectorAll(".game-img");
    for (const gImg of gameBg) {
      perfKit.kitMain.gameItems[gImg.dataset.gamenm]["imgDom"] = gImg;
    }
    gameBg = kitMainDom.querySelectorAll(".game-img-vertical");
    for (const gImg of gameBg) {
      perfKit.kitMain.gameItems[gImg.dataset.gamenm]["imgDom_vertical"] = gImg;
    }
    for (const gameNM of Object.keys(perfKit.kitMain.gameItems)) {
      perfKit.gameData[gameNM] = {};
      for (const config of Object.keys(perfKit.kitMain.perfBadges)) {
        perfKit.gameData[gameNM][config] = false
      }
    }

    perfKit.kitMain.gameSelectUpdate({});
    perfKit.kitMain.CFGkitMainBtHandler.length = 0;
    perfKit.kitMain.CFGkitMainBtHandler.push(perfKit.kitMain.gameSelectUpdate);

    
    perfKit.CFGdataUpdate.push(perfKit.kitMain.perfDrawUpdate);
    perfKit.perfDataUpdate();
    bTK.CFGRdBtHandler.push(perfKit.perfDataUpdate); 

  }
}





document.addEventListener("DOMContentLoaded", function() {

  bTK.crCats();
  bTK.crCOpen();
  bTK.crRdBt();
  bTK.crCbBt();
  bTK.crQuantity();

  bTK.crProdPrice();
  bTK.crHeadSel();
  bTK.crCatDetails();
  bTK.crCatIMG();
  // build.crBuilldIMG();
  
  pr.crFinalPrice();
  nav.crProdNav();
  buildSummary.crSummary();
  bModal.crBuildModal();
  perfKit.crPerfKit();

})