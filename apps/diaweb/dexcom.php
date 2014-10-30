<?php
session_start();

include('constants.php');

$con2 = mysqli_connect(SERVER, DB_LOGIN, DB_PASS, "glucoserecords");
$con3 = mysqli_connect(SERVER, DB_LOGIN, DB_PASS, "dia_events");



$filename = "./server/php/files/".$_SESSION['uid'].".txt";
$handle = file($filename);


$con5 = mysqli_connect(SERVER, DB_LOGIN, DB_PASS, "usr_settings");
   
$qry2 = "UPDATE `u".$_SESSION['uid']   ."` SET `last_parsed`='". date("Y-m-d H:i:s",mktime(0, 0, 0, 7, 1, 2000))."',`last_uploaded`='".date("Y-m-d H:i:s")."'";

$result = mysqli_query($con5, $qry2);

echo $qry2.DB_PASS;

foreach($handle as $line)
  {
  	
 	
 	
 	

 	if (strpos($line,'Patient')!== FALSE||strpos($line,'EventDescription')!==FALSE) {
 		
 		
 		continue;
 	}

 	$length = strlen($line);

 	$number_of_tabs =0;
 	$option2 = false;

 	$dates = array();
 	$values = array();
 	$event_dates = array();
 	$event = array();

 	
 	for($i = 0; $i< $length; $i++){
 		$currchar = substr($line, $i, 1);
 		
 		if($currchar === "\t"){
 			$number_of_tabs++;

 			if($number_of_tabs ===3){
 				$option2 = true;
 				$date = DB_PASS;
 				$glucose_value = DB_PASS;
 				$option1 = true;
 				for($j = $i+1; $j< $length; $j++){
 					if($option1){
 						if(substr($line,$j,1)=== "\t"){
 							$option1 = false;
 							
 							continue;
 						}

 						$date = $date.substr($line, $j, 1);
 						

 					}
 					if(!$option1){
 						if(substr($line,$j,1)=== "\t"){
 							$option1 = false;
 							

 							array_push($dates, $date);
 							array_push($values, $glucose_value);


 							break;
 						}

 						$glucose_value = $glucose_value.substr($line, $j, 1);
 						
 					}



 				}
 			}


 			continue;
 		}

 		if($option2===true){


 			$number_of_tabs =0;
 			

 			for($m = $j ; $m < $length; $m++){
 				$currchar = substr($line, $m, 1);
 				if($currchar === "\t"){
 					$number_of_tabs++;
 					//echo "here";

 					if($number_of_tabs ===6){
 						$edate = DB_PASS;
 						$etype = DB_PASS;
 						$option1 = true;
 						for($p = $m+1; $p< $length; $p++){
			 					if($option1){
			 						if(substr($line,$p,1)=== "\t"){
			 							$option1 = false;
			 							
			 							
			 							continue;
			 						}

			 						$edate = $edate.substr($line, $p, 1);
			 						

			 					}
			 					if(!$option1){
			 						if(substr($line,$p,1)=== "\t"){
			 							$option1 = false;
			 							
			 							//echo $edate. " ". $etype.PHP_EOL;
			 							array_push($event_dates, $edate);
			 							array_push($event, $etype);


			 							break;
			 						}

			 						$etype = $etype.substr($line, $p, 1);
			 						
			 					}


 						}

 					}

 				}

 			}

 			break;
 		}
 	}

 	//CHANGED GLUCOSE VALUES OF 0 !!!
 	for($i = 0; $i< count($values) ; ++$i ){
 		//echo "~~~".$values[$i]."~~~~~".PHP_EOL;
 		if(  $values[$i]=== "High"|| $values[$i]=== "Low"){
 			
 			$values[$i] = $temp;
 			
 		}
 		$temp = $values[$i];

 	}

 	for($i = 0; $i< count($values) ; ++$i ){
	 	$look = "SELECT * FROM u". $_SESSION['uid']." WHERE datev ='".$dates[$i]."'";

	 	$result = mysqli_query($con2, $look);

	 	$num = mysqli_num_rows($result);

	 	



	 	$qry = "INSERT INTO u".$_SESSION['uid']." (datev, glucose) VALUES ('".$dates[$i]."', '".$values[$i]."')";
	 							
	 	if($num ===0)
	 	mysqli_query($con2, $qry);

	}


	for($i = 0; $i < count($event_dates); ++$i){
		//echo "going to database".PHP_EOL;
		$look = "SELECT * FROM u". $_SESSION['uid']." WHERE datev ='".$event_dates[$i]."'";

	 	$result = mysqli_query($con3, $look);

	 	$num = mysqli_num_rows($result);

	 	



	 	$qry = "INSERT INTO u".$_SESSION['uid']." (datev, d_event) VALUES ('".$event_dates[$i]."', '".$event[$i]."')";
	 							
	 	if($num ===0 && $etype !== DB_PASS)
	 	mysqli_query($con3, $qry);
	}


  }

  fclose($handle);


?>