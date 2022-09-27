import json

def crNumberInput(cat, prod):
  res = ""

  if "static-num" in prod:
    res += """
<div class="part-number-input static-number">
  <input type="number" class="part-quantity" id="{prod_code}_qty" name="{cat_code}_qty" value="{static_quant}" readonly>
</div>""".format(
      prod_code = prod["prod-code"],
      cat_code = cat["cat-code"],
      static_quant = prod["static-num"],
    )
  else:
    res += """
<div class="part-number-input">
  <input type="number" class="part-quantity" id="{prod_code}_qty" name="{cat_code}_qty{type_ism}" min="{min}" max="{max}" value="0">
  <i class="bi bi-dash part-num-decr"></i>
  <span class="quantity-display">0</span>
  <i class="bi bi-plus part-num-incr"></i>
</div>""".format(
      prod_code = prod["prod-code"],
      cat_code = cat["cat-code"],
      min = prod["prod-min"],
      max = prod["prod-max"],
      type_ism = "[]" if cat["type"] == "checkbox" else ""
    )  

  return res

def crProdList(cat):
  res = ""
  for prod in cat["product-list"]:

    prodStr = """
<input type="{btn_type}" class="{type_class}" id="{prod_code}" name="{cat_code}{type_ism}" value="{prod_val}"{prod_erp}>
<label class="listed-part" for="{prod_code}">
  <div class="part-img">
    <img class="build-img" src="img/{prod_code}.jpg" width="100%">
  </div>
  <div class="part-text">
    <div class="part-text-head fs-xs">
      {prod_name}
    </div>
  </div>
  {number_input}
  <div class="prod-quick-view">
    <a class="quick-view-btn fs-sm" data-productid="38615" href="#quick-view" data-bs-toggle="modal"><i class="bi bi-eye"></i></a>
  </div>
  <div class="part-price fw-bold" data-priceval="{prod_price}">
    <span class="price-block">+0,00€</span>
  </div>
</label>""".format(
      prod_code = prod["prod-code"],
      prod_val = prod["prod-code"] if prod["prod-erp"] != "-" else "0",
      cat_code = cat["cat-code"],
      prod_erp = f' data-erp="{prod["prod-erp"]}"' if prod["prod-erp"] != "-" else "",
      prod_name = prod["prod-name"],
      number_input = crNumberInput(cat, prod),
      prod_price = prod["prod-price"],
      btn_type = "checkbox" if cat["type"] == "checkbox" else "radio",
      type_ism = "[]" if cat["type"] == "checkbox" else "",
      type_class = "part-checkbox" if cat["type"] == "checkbox" else "part-rd-bt"
    )
    
    res += prodStr

  return res

def crCat(cat):
  res = """
<div class="builder-part-category" id="{catId}">
  <div class="part-category-header">
    <div class="part-category-img"><img src="img/cat29-prod0.jpg"></div>
    <div class="part-category-bar">{catName}</div>
    <div class="part-category-details">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
  </div>
  {description}
  <div class="part-list-container">
    {prodlist}
  </div>
</div>""".format(
    catId = cat["cat-code"],
    catName = cat["cat-name"],
    description = "" if cat["cat-desc"] == "$blank" else f'<div class="part-category-description fs-md bg-secondary">{cat["cat-desc"]}</div>',
    prodlist = crProdList(cat)
  )

  return res


def crContent():  
  catList = ""

  for cat in prodlist:
    catList += crCat(cat)

  res = """
<form class="col-lg-9 col-md-8 order-lg-1 builder-parts prod-form-body" id="builder-form" method="GET" action="_blank">
  <input type="hidden" name="system_name" value="Msystems Intel 12th Gen Gaming" readonly="">
  <input type="hidden" name="system_erp_code" value="500-00002" readonly="">
  {catlist}  
</form>""".format(catlist = catList)

  return res




with open("product-list.json","r",encoding="UTF-8") as rawjson:
    prodlist = json.loads(rawjson.read())
with open("index-template.html","r",encoding="UTF-8") as readtemp:
    results = readtemp.read().format(
      category_container = crContent(),
      quick_view_modal = "",
      build_modal = ""
      )
with open("../index.html","w",encoding="UTF-8") as out:
    out.write(results)