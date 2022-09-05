function rDuplicates(ar) {
  let uAr = []
  for (let itm of ar) {
    if (!uAr.includes(itm)) uAr.push(itm)
  }
  return uAr
}


let total = 0;
let dl = 0;
for (let cnm of domCashe.domOrder) {
  let cat = domCashe.dom[cnm];

  let uOrder = rDuplicates(cat.prodOrder);

  for (let i=0;i<uOrder.length&&i<12;i++) {
    let ldl = dl;
    dl++
    let cnm = uOrder[i];
    let prod = cat.prodList[cnm];
    setTimeout(()=>{
      fetch(prod.cDom.querySelector(".build-img").src.replace("sys_thumbs","cat_thumbs")).then(function(response) {
        return response.blob()
      }).then(function(blb){
        let nEl = document.createElement("template");
        nEl.innerHTML = 
          `<a href="${URL.createObjectURL(blb)}"
              download="${cnm}"
              class="d-none imgdownload"></a>`
        ;
        nEl = nEl.content.firstElementChild;
        // console.log(nEl);
        document.body.insertAdjacentElement("beforeend", nEl);
        nEl.click();
      }) 
    },ldl*1000);
      
    total++
    // break;
  }

  // break;  
}
console.log(total);

//let tsum = ""; document.querySelectorAll(".imgdownload").forEach(a=>tsum+= a.download+"\n");console.log(tsum);