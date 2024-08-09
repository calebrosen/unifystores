<?php
include 'db.php';
 
if (!$con) {
  die("Connection failed: " . mysqli_connect_error());
}

if (isset($_GET['model_id'])){
   $model_id = $_GET['model_id'];
}

switch ($method) {
    case 'GET':
      $sql = "SELECT DISTINCT PR.grid_column_start, PR.grid_column_end, PR.grid_row_start, PR.grid_row_end, PR.description,
      P.product_id, P.model, P.quantity, P.image, P.price, PD.name, PD.tag, round(P.price *.9,2) AS special_price, 'Dummy Keyword'
      FROM part_diagrams_model_part_relations PR  
      INNER JOIN product P ON P.product_id = PR.part_id 
      INNER JOIN product_description PD ON PD.product_id = P.product_id
      WHERE PR.model_id = '$model_id'";
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