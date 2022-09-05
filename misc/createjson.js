function rDuplicates(ar) {
  let uAr = []
  for (let itm of ar) {
    if (!uAr.includes(itm)) uAr.push(itm);
  }
  return uAr
}



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
  
  let uOrder = rDuplicates(cat.prodOrder);

  for (let i=0;i<uOrder.length&&i<12;i++) {
    let prod = cat.prodList[uOrder[i]];
  
    qCat["product-list"].push({
      "prod-code": uOrder[i],
      "prod-name": prod.nmTxt,
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