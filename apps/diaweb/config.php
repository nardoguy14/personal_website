<?php

include('constants.php');

$link = mysqli_connect(SERVER, DB_LOGIN, DB_PASS);
if (!$link) {
    die('Could not connect: ' . mysql_error());
}

$databases = array();
array_push($databases, "diabetes");
array_push($databases, "glucoserecords");
array_push($databases, "dia_events");
array_push($databases, "usr_settings");


for($i = 0; $i < count($databases); $i++){
	$sql = 'CREATE DATABASE '. $databases[$i];
	if (mysqli_query(  $link, $sql)) {
	    echo "Database ". $databases[$i]." created successfully\n";
	} else {
	    echo 'Error creating database: ' . mysqli_error() . "\n";
	}

}

$diabetes = mysqli_connect(SERVER, DB_LOGIN, DB_PASS, "diabetes");

$user_table = "CREATE TABLE users (uid INT NOT NULL AUTO_INCREMENT PRIMARY KEY, username VARCHAR(32), email VARCHAR(32), password VARCHAR(32), name VARCHAR(32) ) ";



$global_tables = array();
array_push($global_tables, $user_table);




echo count($global_tables);
for($i = 0; $i< count($global_tables); $i++){
	if(mysqli_query( $diabetes, $global_tables[$i] )){
		echo "Table created successfully";

	}
	else{
		echo "Error creating table: ". mysqli_error(). "\n";
	}
}

?>