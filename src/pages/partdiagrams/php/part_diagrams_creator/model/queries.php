<?php 

 $root_path = $_SERVER['DOCUMENT_ROOT'];

// include($root_path . '/part_diagrams/part_diagrams_edit/includes/db.php');
$host = "localhost";
$user = "partsconnect";
$password = "shut_0ff_v4lv3!";
$dbname = "partsdb";
$port = "3306";

$connectioncreator = mysqli_connect($host, $user, $password, $dbname, $port);

$db =mysqli_connect($host, $user, $password, $dbname, $port);



function select_models() {
    global $connectioncreator;

    $query = 'SELECT model_id, model, model_name FROM part_diagrams_models ORDER BY model_name';
    $result = mysqli_query($connectioncreator, $query);
    if ($result) {
        $models = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $models[] = $row;
        }
        mysqli_free_result($result);
        return $models;
    } else {
        // Handle the query error, e.g., log the error or show an error message.
        // For simplicity, we'll return an empty array here, but you may want to handle the error differently.
        return [];
    }
}


function select_model($id) {
    global $connectioncreator;
    $query = 'SELECT DISTINCT PR.grid_column_start, PR.grid_column_end, PR.grid_row_start, PR.grid_row_end, 
    P.product_id, P.model, P.quantity, P.image, P.price, PD.name, PD.tag, PS.price AS special_price 
    FROM part_diagrams_model_part_relations PR  
    INNER JOIN product P ON P.product_id = PR.part_id 
    INNER JOIN product_description PD ON PD.product_id = P.product_id 
    INNER JOIN product_special PS ON PS.product_id = P.product_id 
    WHERE PR.model_id = ?';
    $statement = mysqli_prepare($connectioncreator, $query);
    mysqli_stmt_bind_param($statement, 'i', $id);
    mysqli_stmt_execute($statement);
    $result = mysqli_stmt_get_result($statement);
    $models = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $models[] = $row;
    }
    mysqli_free_result($result);
    mysqli_stmt_close($statement);
    return $models;
}

function insert_city($newcity, $countrycode, $district, $newpopulation) {
    global $connectioncreator;
    $count = 0;
    $query = "INSERT INTO city (Name, CountryCode, District, Population) VALUES (?, ?, ?, ?)";
    $statement = mysqli_prepare($connectioncreator, $query);
    mysqli_stmt_bind_param($statement, 'sssi', $newcity, $countrycode, $district, $newpopulation);
    if (mysqli_stmt_execute($statement)) {
        $count = mysqli_stmt_affected_rows($statement);
    };
    mysqli_stmt_close($statement);
    return $count;
}

function update_city($id, $city, $countrycode, $district, $population) {
    global $connectioncreator;
    $count = 0;
    $query = 'UPDATE city SET Name = ?, CountryCode = ?, District = ?, Population = ? WHERE ID = ?';
    $statement = mysqli_prepare($connectioncreator, $query);
    mysqli_stmt_bind_param($statement, 'sssii', $city, $countrycode, $district, $population, $id);
    if (mysqli_stmt_execute($statement)) {
        $count = mysqli_stmt_affected_rows($statement);
    };
    mysqli_stmt_close($statement);
    return $count;
}

function delete_city($id) {
    global $connectioncreator;
    $count = 0;
    $query = 'DELETE FROM city WHERE ID = ?';
    $statement = mysqli_prepare($connectioncreator, $query);
    mysqli_stmt_bind_param($statement, 'i', $id);
    if (mysqli_stmt_execute($statement)) {
        $count = mysqli_stmt_affected_rows($statement);
    };
    mysqli_stmt_close($statement);
    return $count;
}

?>
