const products = [
  { brand: { name: "Nike" } },
  { brand: { name: "Adidas" } },
  { brand: { name: "Nike" } },
  { brand: { name: "Puma" } },
  { brand: { name: "Nike" } }
]

let brandCounts = {}
let brandName
products.map(p=>{ 
   brandName = p.brand?.name; 
  if(brandName ==="Nike"){
    brandCounts[brandName] = (brandCounts[brandName]||0)+900
  }else{
    brandCounts[brandName] = (brandCounts[brandName]||0)+1
  }

})
console.log(brandCounts)
  fetch()



function fetch(){
    if(products.includes("Nike")){
    brandCounts["Nike"] = "flower"
    
    }
    return     brandCounts["Nike"] = "flower"

}


console.log(brandCounts)
