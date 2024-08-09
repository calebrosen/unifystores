<?php
include 'db.php';
 
if (!$con) {
  die("Connection failed: " . mysqli_connect_error());
}

if (isset($_GET['model'])){
   $model = $_GET['model'];
}


switch ($method) {
    case 'GET':
      $sql = "SELECT model_id, model, model_name, model_type, model_img_src FROM part_diagrams_models WHERE model = '$model'";
      break;
}

// run SQL statement
$result = mysqli_query($con, $sql);

// die if SQL statement failed
if (!$result) {
  http_response_code(404);
  die(mysqli_error($con));
}
 
if ($method == 'GET') {
  // echo json_encode(($result));
    if (!$id) echo '[';
    for ($i=0 ; $i<mysqli_num_rows($result) ; $i++) {
      echo ($i>0?',':'').json_encode(mysqli_fetch_object($result));
    }
    if (!$id) echo ']';
}else {
    echo mysqli_affected_rows($con);
}
 
$con->close();
