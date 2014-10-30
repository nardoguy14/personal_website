<?php
session_start();
error_reporting(0);

include('constants.php');

$action = $_GET['action'];

$name = $_GET['fullname'];
$username = $_GET['username'];
$email = $_GET['email'];
$pass = $_GET['password'];



$id = $_GET['id'];
$url = $_GET['url'];



$idnum = $_GET['idnum'];

$date = $_GET['date'];
$fromtime = $_GET['fromtime'];
$totime = $_GET['totime'];

$low_setting_value = $_GET['low_setting_value'];
$high_setting_value = $_GET['high_setting_value'];

$binsize = $_GET['binsize'];





$con=mysqli_connect(SERVER,DB_LOGIN,DB_PASS,"diabetes");




if($action == "register"){
	
	echo "went here";


	$qry = "INSERT INTO users (name, email, password, username)
	VALUES ('$name', '$email', '$pass', '$username')";

	mysqli_query($con, $qry);

	$qry = "SELECT * FROM users WHERE username = '$username' AND password = '$pass'";
	$result=mysqli_query($con, $qry);
	while($row = mysqli_fetch_array($result)){
		
		$_SESSION['uid'] = $row['uid'];
		echo $_SESSION['uid'];
		
	}

	
	$_SESSION['username'] = $username;
	$_SESSION['fullname'] = $name;



	$con2 = mysqli_connect(SERVER, DB_LOGIN, DB_PASS, "glucoserecords");

	$qry2 = " CREATE TABLE u".$_SESSION['uid']. "(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,  datev DATETIME, glucose VARCHAR(20))";
	mysqli_query($con2, $qry2);

	$con2 = mysqli_connect(SERVER, DB_LOGIN, DB_PASS, "dia_events");

	$qry2 = " CREATE TABLE u".$_SESSION['uid']. "(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,  datev DATETIME, d_event VARCHAR(20))";
	mysqli_query($con2, $qry2);

	$con2 = mysqli_connect(SERVER, DB_LOGIN, DB_PASS, "usr_settings");

	$qry2 = " CREATE TABLE u".$_SESSION['uid']. "( low_limit INT, high_limit INT, binsize INT, stored_parsed_values LONGTEXT, last_parsed DATETIME, last_uploaded DATETIME)";
	mysqli_query($con2, $qry2);
	$qry2 = "INSERT INTO u".$_SESSION['uid']. " (low_limit, high_limit, binsize) VALUES (80, 120, 10)";
	mysqli_query($con2, $qry2);

}
else if( $action == "login"){
	

	$qry = "SELECT * FROM users WHERE username = '$username' AND password = '$pass'";
	$result=mysqli_query($con, $qry);
	while($row = mysqli_fetch_array($result)){
		
		$_SESSION['uid'] = $row['uid'];
		$_SESSION['username'] = $row['username'];
		$_SESSION['fullname'] = $row['fullname'];
	}

	
	echo $_SESSION['username'] ;

}
else if ( $action == "logout"){
	session_destroy();
}
else if($action == "updaterange"){


 					
                        






    $con2 = mysqli_connect(SERVER, DB_LOGIN, DB_PASS, "glucoserecords");
   

    

    if(strpos($fromtime, "PM")){
    	$i = 0;
    	$pre = DB_PASS;
    	while(substr($fromtime, $i, 1) !== ":"){
    		$pre .= substr($fromtime, $i,1);
    		$i++;

    	}

    	$value = (int)$pre;
    	$value += 12;
    	$value += DB_PASS;

    	$space_index = strpos($fromtime, " ");
    	$string_len = strlen($fromtime);
    	$value_len = strlen($value);

    	$final = $value.substr($fromtime, $i);

    	$space = strpos($final, " ");
    	$final = substr($final, 0, (strlen($final)-$space+2));
    	$final .= ":00";
    	
    	$fromtime = $final;

    }

    if(strpos($totime, "PM")){
    	$i = 0;
    	$pre = DB_PASS;
    	while(substr($totime, $i, 1) !== ":"){
    		$pre .= substr($totime, $i,1);
    		$i++;

    	}

    	$value = (int)$pre;
    	$value += 12;
    	$value += DB_PASS;

    	$space_index = strpos($totime, " ");
    	$string_len = strlen($totime);
    	$value_len = strlen($value);

    	$final = $value.substr($totime, $i);

    	$space = strpos($final, " ");
    	$final = substr($final, 0, (strlen($final)-$space+2));
    	$final .= ":00";
    	$totime = $final;
    	

    }

    if(strpos($totime, "AM") ){
    	$space = strpos($totime, " ");
    	$totime = substr($totime, 0, $space).":00";
    	
    }

    if(strpos($fromtime, "AM") ){
    	$space = strpos($fromtime, " ");
    	$fromtime = substr($fromtime, 0, $space).":00";
    	
    }

    
	$from = $date." ".$fromtime;
	$to = $date." ".$totime;

	$checkfrom = (int)date("U", strtotime($from)) *1000;
	$checkto = (int)date("U", strtotime($to)) *1000;
	if($checkfrom> $checkto){
		echo "bad";
		return false;
	}


	

	$qry2 = "SELECT * FROM u".$_SESSION['uid']." WHERE datev >= '".$from."' AND datev <= '".$to."'";
	
	$result = mysqli_query($con2, $qry2);
	
	$arrayholder = array();
	$glucose_values = array();
	$date_values = array();
	
	
	$m = 0;
	while($row = mysqli_fetch_array($result)){

		$temp = array();

		//used to build data for use immediately
		array_push($temp, ((int)date("U", strtotime($row["datev"])) )*1000  );
  		array_push($temp, (int)$row["glucose"]);
  		array_push($temp, $m);
  		++$m;
  		//used for later rate of change
  		array_push($glucose_values, (int)$row["glucose"]);
  		array_push($date_values, ((int)date("U", strtotime($row["datev"])) )*1000  );

  		//pushed in as pair for highchart [ date, glucose value]
  		array_push($arrayholder, $temp);
		
	}
	//first array in holder is just straight up glucose values
	$arrayholder = array($arrayholder);
	

	//Takes glucose values and date values and puts them in format
	//for highcharts.
	roc($glucose_values, $arrayholder, $date_values);
	

	$con2 = mysqli_connect(SERVER, DB_LOGIN, DB_PASS, "dia_events");

	$qry2 = "SELECT * FROM u".$_SESSION['uid'];

	$result = mysqli_query($con2, $qry2);
	
	$poop = array();
	
	
	while($row = mysqli_fetch_array($result)){

		if($row['d_event']=== "Carbs"){
			$temp = array();


			array_push($temp, ((int)date("U", strtotime($row["datev"])) )*1000);
			array_push($poop, $temp);
		}

	}
			$temp = array();
			array_push($temp, 1377681487000);
			array_push($poop, $temp);

	array_push($arrayholder, $poop);

	echo json_encode($arrayholder);


	
}
else if($action == "alldata"){
	
	$con10 = mysqli_connect(SERVER, DB_LOGIN, DB_PASS, "usr_settings");
   
	$qry2 = "SELECT * FROM u".$_SESSION['uid']   ;

	$result = mysqli_query($con10, $qry2);

	$pool_old = false;

	$saved_data = DB_PASS;
 
	while($row = mysqli_fetch_array($result)){
		if(    ((int)date("U", strtotime($row["last_uploaded"])) )*1000  == ((int)date("U", strtotime($row["last_parsed"])) )*1000    ){
			$pool_old = true;
			$saved_data = $row['stored_parsed_values'];
			
		}
		

	}

	if($pool_old== true){
		echo $saved_data;
	}
	else if( $pool_old == false){
		
		$con2 = mysqli_connect(SERVER, DB_LOGIN, DB_PASS, "glucoserecords");
	   
		$qry2 = "SELECT * FROM u".$_SESSION['uid'] ." WHERE datev>='".date("Y-m-d H:i:s", mktime(0,0,0,2,2,2014))."'";  ;

		$result = mysqli_query($con2, $qry2);
		
		$arrayholder = array();
		$glucose_values = array();
		$date_values = array();
		
		
		$m = 0;
		while($row = mysqli_fetch_array($result)){

			$temp = array();

			//used to build data for use immediately
			array_push($temp, ((int)date("U", strtotime($row["datev"])) )*1000  );
	  		array_push($temp, (int)$row["glucose"]);
	  		array_push($temp, $m);
	  		++$m;
	  		//used for later rate of change
	  		array_push($glucose_values, (int)$row["glucose"]);
	  		array_push($date_values, ((int)date("U", strtotime($row["datev"])) )*1000  );

	  		//pushed in as pair for highchart [ date, glucose value]
	  		array_push($arrayholder, $temp);
			
		}
		//first array in holder is just straight up glucose values
		$arrayholder = array($arrayholder);

		//Takes glucose values and date values and puts them in format
		//for highcharts.
		roc($glucose_values, $arrayholder, $date_values);

		$con2 = mysqli_connect(SERVER, DB_LOGIN, DB_PASS, "dia_events");

		$qry2 = "SELECT * FROM u".$_SESSION['uid'];


		$result = mysqli_query($con2, $qry2);
		
		


		$poop = array();
		
		while($row = mysqli_fetch_array($result)){

			if($row['d_event']=== "Carbs"){
				$temp = array();


				array_push($temp, ((int)date("U", strtotime($row["datev"])) )*1000);
				array_push($poop, $temp);
			}

		}
		array_push($arrayholder, $poop);

		echo json_encode($arrayholder);

		$qry2 = "UPDATE `u".$_SESSION['uid']   ."` SET `last_parsed`='". date("Y-m-d H:i:s")."',`last_uploaded`='".date("Y-m-d H:i:s")."', `stored_parsed_values`='".json_encode($arrayholder)."'";

		$result = mysqli_query($con10, $qry2);
	}
}

else if($action == "get_settings"){
	
	$con2 = mysqli_connect(SERVER, DB_LOGIN, DB_PASS, "usr_settings");
   
	$qry2 = "SELECT * FROM u".$_SESSION['uid'];

	$result = mysqli_query($con2, $qry2);

	$low_high_values = array();

	while($row = mysqli_fetch_array($result)){
		array_push($low_high_values, $row['low_limit']);

		array_push($low_high_values, $row['high_limit']);
		array_push($low_high_values, $row['binsize']);
		

	}
	
	

	echo json_encode($low_high_values);
}
else if($action == "set_settings"){
	
	$con2 = mysqli_connect(SERVER, DB_LOGIN, DB_PASS, "usr_settings");
   
	$qry2 = "UPDATE `u".$_SESSION['uid']   ."` SET `low_limit`=".$low_setting_value.",`high_limit`=".$high_setting_value.",`binsize`=".$binsize;

	$result = mysqli_query($con2, $qry2);

	
}

function roc(&$glucose_values, &$arrayholder, $date_values){
	$rateofchangevalues = array();
	for($i = 0; $i < count($glucose_values); ++$i){
		if($i === 0){
			$before = $i;
			$after = $i+1;

			$top = $glucose_values[$after]- $glucose_values[$before];

			$slope = $top/10;
		}
		else if( $i === count($glucose_values)-1){
			$before = $i-1;
			$after = $i;

			$top = $glucose_values[$after]- $glucose_values[$before];

			$slope = $top/10;
		}
		else{
			$before = $i-1;
			$after = $i+1;

			$top = $glucose_values[$after]- $glucose_values[$before];

			$slope = $top/10;
		}
		array_push($rateofchangevalues, $slope);
	}

	//CHANGED ROC VALUES THAT ARE TOO HIGH!!!
	for($i = 0; $i < count($rateofchangevalues); ++$i){
		
		if($rateofchangevalues[$i] >7)
			$rateofchangevalues[$i]= $temp;

		$temp = $rateofchangevalues[$i];
		
	}


	$roc_array = array();
	for($i = 0; $i < count($date_values); ++$i){
		$temp = array();
		array_push($temp, $date_values[$i]);
		array_push($temp, $rateofchangevalues[$i]);
		array_push($temp, $i);

		array_push($roc_array, $temp);
	}

	array_push($arrayholder, $roc_array);
}




?>