let total = 0;
for (let cnm of domCashe.domOrder) {
  let cat = domCashe.dom[cnm]

  for (let i=0;i<cat.prodOrder.length&&i<12;i++) {
    let cnm = cat.prodOrder[i];
    let prod = cat.prodList[cnm];
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
    total++
    // break;
  }

  // break;  
}
console.log(total);

//let tsum = ""; document.querySelectorAll(".imgdownload").forEach(a=>tsum+= a.download+"\n");console.log(tsum);