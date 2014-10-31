<?php

$name = "nardo";//$_GET['name']; 
$email = "dsl";//$_GET['email']; 
$subject = "fksjdl";//$_GET['subject']; 
$message = "ksdl";//$_GET['message']; 

$con = mysqli_connect("localhost", "nardo", "camera14", "diabetes");

$qry = "INSERT INTO `general`  (name, email, subject, message) VALUES ('$name', '$email', '$subject', '$message')";

$result=mysqli_query($con, $qry);





?>