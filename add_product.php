<?php

include "config.php";

if(isset($_POST['name'])){

$name = $_POST['name'];
$category = $_POST['category'];
$price = $_POST['price'];
$quantity = $_POST['quantity'];

/* CHECK IF PRODUCT EXISTS */

$check = mysqli_query($conn,
"SELECT * FROM products WHERE name='$name' AND category='$category'");

if(mysqli_num_rows($check) > 0){

mysqli_query($conn,
"UPDATE products 
SET quantity = quantity + $quantity, price='$price'
WHERE name='$name' AND category='$category'");

echo "updated";

}else{

mysqli_query($conn,
"INSERT INTO products(name,category,price,quantity)
VALUES('$name','$category','$price','$quantity')");

echo "added";

}

}
?>