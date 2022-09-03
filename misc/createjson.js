// let rawList = []
// for (let cat of document.querySelectorAll(".builder-part-category")) {
//   let prodList = cat.querySelectorAll(".part-rd-bt, .part-checkbox");

//   let qCat = {
//     "cat-code": cat.id,
//     "cat-name": cat.firstElementChild.textContent,
//     "cat-desc": "Το σπίτι του νέου σας συστήματος. Επιλέξτε το μοντέλο και το χρώμα που προτιμάτε!",
//     "type": "$blank",
//     "init-prod": "$blank",
//     "singleQuant": false,
//     "product-list": []
//   } 
  
  
//   console.log(prodList.length);
//   for (let i=0;i<prodList.length&&i<12;i++) {
//     qCat["product-list"].push({
//       "prod-code": prodList[i].id,
//       "prod-name": prodList[i].nextElementSibling.querySelector(".part-text-head").innerHTML,
//       "prod-erp": prodList[i].dataset.erp,
//       "prod-price": prodList[i].value,
//     })

//     if (prodList[i].nextElementSibling.querySelector(".part-number-input")) {
//       let tmpQ = prodList[i].nextElementSibling.querySelector(".part-number-input")

//       if (tmpQ.classList.contains("static-number")) {
//         qCat["product-list"][i]["static-num"] = tmpQ.querySelector(".part-quantity").value;
//       } else {
//         qCat["product-list"][i]["prod-min"] = tmpQ.querySelector(".part-quantity").min;
//         qCat["product-list"][i]["prod-max"] = tmpQ.querySelector(".part-quantity").max;
//       }
//     } else {
//       qCat["product-list"][i]["static-num"] = "1";
//     }
//   }


//   rawList.push(qCat);
// }
// console.log(JSON.stringify(rawList));



//@@@@@@@@@@@@@@@@@@@@@@@@@@@



let rawList = []
for (let cnm of domCashe.domOrder) {
  let cat = domCashe.dom[cnm]

  let qCat = {
    "cat-code": cnm,
    "cat-name": cat.nmTxt,
    "cat-desc": cat.selfDom.querySelector(".part-category-description")?cat.selfDom.querySelector(".part-category-description").innerHTML:"$blank",
    "type": cat.prodType,
    "init-prod": "$blank",
    "singleQuant": false,
    "product-list": []
  } 
  
  
  for (let i=0;i<cat.prodOrder.length&&i<12;i++) {
    let prod = cat.prodList[cat.prodOrder[i]];
  
    qCat["product-list"].push({
      "prod-code": cat.prodOrder[i],
      "prod-name": prod.nmTxt.innerHTML,
      "prod-erp": prod.erp,
      "prod-price": prod.priceVal.toString(),
    })

    if (prod.qType == "static") {
      qCat["product-list"][i]["static-num"] = prod.qValue.toString();
    } else {
      qCat["product-list"][i]["prod-min"] = prod.qMin.toString();
      qCat["product-list"][i]["prod-max"] = prod.qMax.toString();
    }
  }


  rawList.push(qCat);
}
console.log(JSON.stringify(rawList));