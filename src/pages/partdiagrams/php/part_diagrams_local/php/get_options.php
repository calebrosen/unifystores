<?php
include 'db.php';
 
if (!$con) {
  die("Connection failed: " . mysqli_connect_error());
}

// if (isset($_GET['part_id'])){
//    $part_id = $_GET['part_id'];
// }

if (isset($_GET['partid'], $_GET['modelid'])){
  $part_id = $_GET['partid'];
  $model_id = $_GET['modelid'];
}

switch ($method) {
  case 'GET':
    $sql = "SELECT DISTINCT O.option_part_id, O.model_id, O.description, P.model, P.image, P.price, P.quantity, PD.name, 'Dummy Price', 'Dummy Keyword'
    FROM  part_diagrams_part_options O 
    INNER JOIN oc_master.product P ON P.product_id = O.option_part_id 
    INNER JOIN oc_master.product_description PD ON PD.product_id = P.product_id 
    WHERE O.part_id = '$part_id' AND O.model_id = '$model_id'";
    break;
}

// run SQL statement
$result = mysqli_query($con,$sql);

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
?>