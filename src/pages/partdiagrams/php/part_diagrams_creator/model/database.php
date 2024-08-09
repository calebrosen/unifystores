<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


$root_path = $_SERVER['DOCUMENT_ROOT'];

include($root_path . '/part_diagrams/part_diagrams_edit/includes/db.php');

	 // check connection
	 if(!$connection){
		echo 'Connection error: '. mysqli_connect_error();
	 }
	else { echo 'Connection successful';
	}

	// write query for all models
	$sql = 'SELECT model_id, model, model_name  	ROM part_diagrams_models';

	// get the result set (set of rows)
	$result = mysqli_query($connection, $sql);

	// fetch the resulting rows as an array
	$models = mysqli_fetch_all($result, MYSQLI_ASSOC);
	// debug_to_console(json_encode($models));

	// free the $result from memory (good practise)
	mysqli_free_result($result);

	// close connection
	mysqli_close($connection);