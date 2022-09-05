import json

def crCat(cat):
  res = """
<div class="builder-part-category" id="{catId}">
  <div class="part-category-head">{catName}</div>
  {description}   
  <div class="part-list-container-outer">
    <div class="part-list-container">
      {prodlist}
    </div>
  </div>
</div>""".format(
    catId = cat["cat-code"],
    catName = cat["cat-name"],
    description = "" if cat["cat-desc"] == "$blank" else f'<div class="part-category-description fs-md bg-secondary">{cat["cat-desc"]}</div>',
    prodlist = ""
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
      navigation_menu = "",
      category_container = crContent(),
      quick_view_modal = "",
      build_modal = ""
      )
with open("../index.html","w",encoding="UTF-8") as out:
    out.write(results)