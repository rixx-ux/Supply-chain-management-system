let chart

document.addEventListener("DOMContentLoaded",function(){

loadProducts()

document.getElementById("search").addEventListener("keyup",function(){
searchProducts(this.value)
})

/* ADD OR UPDATE PRODUCT */

document.getElementById("productForm").addEventListener("submit",function(e){

e.preventDefault()

let formData=new FormData(this)

let id=document.getElementById("productId").value

let url=id ? "update_product.php" : "add_product.php"

fetch(url,{
method:"POST",
body:formData
})

.then(res=>res.text())
.then(()=>{

loadProducts()

let modal=bootstrap.Modal.getInstance(document.getElementById("productModal"))
modal.hide()

this.reset()

document.getElementById("productId").value=""

})

})

})



function loadProducts(){

fetch("fetch_products.php")
.then(res=>res.json())
.then(data=>{

let table=""
let totalProducts=data.length
let lowStock=0
let totalStock=0

let names=[]
let quantities=[]
let colors=[]

data.forEach(product=>{

totalStock+=parseInt(product.quantity)

names.push(product.name)
quantities.push(product.quantity)
colors.push("rgba(54,162,235,0.6)")

if(product.quantity<5){
lowStock++
}

let status=product.quantity<5
? "<span class='badge bg-danger'>Low Stock</span>"
: "<span class='badge bg-success'>In Stock</span>"

let rowClass=product.quantity<5?"table-danger":""

table+=`

<tr class="${rowClass}">

<td>${product.id}</td>
<td>${product.name}</td>
<td>${product.category}</td>
<td>${product.price}</td>
<td>${product.quantity}</td>
<td>${status}</td>
<td>${product.last_updated}</td>

<td>

<button class="btn btn-warning btn-sm me-1"
onclick="editProduct(${product.id},'${product.name}','${product.category}',${product.price},${product.quantity})">
Update
</button>

<button class="btn btn-danger btn-sm"
onclick="deleteProduct(${product.id})">
Delete
</button>

</td>

</tr>

`

})

document.getElementById("productTable").innerHTML=table

document.getElementById("totalProducts").innerText=totalProducts
document.getElementById("lowStock").innerText=lowStock
document.getElementById("totalStock").innerText=totalStock

updateChart(names,quantities,colors)

})

}



function searchProducts(keyword){

fetch("fetch_products.php")
.then(res=>res.json())
.then(data=>{

let table=""
let resultCard=""
let names=[]
let quantities=[]
let colors=[]

data.forEach(product=>{

let highlight=false

if(
product.name.toLowerCase().includes(keyword.toLowerCase()) ||
product.category.toLowerCase().includes(keyword.toLowerCase())
){

highlight=true

resultCard=`

<div class="card border-primary mb-3">

<div class="card-body">

<h5>Search Result</h5>

<p><b>Name:</b> ${product.name}</p>
<p><b>Category:</b> ${product.category}</p>
<p><b>Price:</b> ${product.price}</p>
<p><b>Quantity:</b> ${product.quantity}</p>

</div>

</div>

`

}

let status=product.quantity<5
? "<span class='badge bg-danger'>Low Stock</span>"
: "<span class='badge bg-success'>In Stock</span>"

table+=`

<tr>

<td>${product.id}</td>
<td>${product.name}</td>
<td>${product.category}</td>
<td>${product.price}</td>
<td>${product.quantity}</td>
<td>${status}</td>
<td>${product.last_updated}</td>

<td>

<button class="btn btn-warning btn-sm me-1"
onclick="editProduct(${product.id},'${product.name}','${product.category}',${product.price},${product.quantity})">
Update
</button>

<button class="btn btn-danger btn-sm"
onclick="deleteProduct(${product.id})">
Delete
</button>

</td>

</tr>

`

names.push(product.name)
quantities.push(product.quantity)

colors.push(highlight ? "orange" : "rgba(54,162,235,0.6)")

})

document.getElementById("productTable").innerHTML=table
document.getElementById("searchResult").innerHTML=resultCard

updateChart(names,quantities,colors)

})

}



function updateChart(names,quantities,colors){

let ctx=document.getElementById("stockChart")

if(chart){
chart.destroy()
}

chart=new Chart(ctx,{

type:"bar",

data:{
labels:names,
datasets:[{
label:"Stock Quantity",
data:quantities,
backgroundColor:colors
}]
}

})

}



function editProduct(id,name,category,price,quantity){

document.getElementById("productId").value=id
document.getElementById("name").value=name
document.getElementById("category").value=category
document.getElementById("price").value=price
document.getElementById("quantity").value=quantity

let modal=new bootstrap.Modal(document.getElementById("productModal"))
modal.show()

}



function deleteProduct(id){

if(confirm("Delete this product?")){

fetch("delete_product.php",{

method:"POST",

headers:{
"Content-Type":"application/x-www-form-urlencoded"
},

body:"id="+id

})
.then(()=>loadProducts())

}

}



function showLowStock(){

fetch("fetch_products.php")
.then(res=>res.json())
.then(data=>{

let table=""

data.forEach(product=>{

if(product.quantity < 5){

table += `

<tr class="table-danger">

<td>${product.id}</td>
<td>${product.name}</td>
<td>${product.category}</td>
<td>${product.price}</td>
<td>${product.quantity}</td>
<td><span class="badge bg-danger">Low Stock</span></td>
<td>${product.last_updated}</td>

<td>

<button class="btn btn-warning btn-sm me-1"
onclick="editProduct(${product.id},'${product.name}','${product.category}',${product.price},${product.quantity})">
Update
</button>

<button class="btn btn-danger btn-sm"
onclick="deleteProduct(${product.id})">
Delete
</button>

</td>

</tr>

`

}

})

document.getElementById("productTable").innerHTML = table

})

}
