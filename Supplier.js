let chart

document.addEventListener("DOMContentLoaded",function(){

loadProducts()

document.getElementById("search").addEventListener("keyup",function(){
searchProducts(this.value)
