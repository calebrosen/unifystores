<?php

include "includes/db.php";
include "includes/header.php";

// Check if model_id and model are set in the URL
if (isset($_GET['model_id'], $_GET['model'])) {
    // Get the model_id and model from the URL
    $model_id = escape($_GET['model_id']);
    $model = escape($_GET['model']);
}

// Handle form submission when creating a part relation
if (isset($_POST['create_part'])) {
    // Get the part_id and other details from the form data
    $part_model = $_POST['part_model'];
    $part_id = $_POST['part_id'];
    $description = $_POST['description'];
    $grid_column_start = $_POST['grid_column_start'];
    $grid_column_end = $_POST['grid_column_end'];
    $grid_row_start = $_POST['grid_row_start'];
    $grid_row_end = $_POST['grid_row_end'];

    // Create the query to insert the part relation into the database
    $query = "INSERT INTO part_diagrams_model_part_relations (model_id, model, part, part_id, `description`, grid_column_start, grid_column_end, grid_row_start, grid_row_end) VALUES ('$model_id','$model','$part_model', '$part_id', '$description','$grid_column_start','$grid_column_end','$grid_row_start','$grid_row_end')";

    // Execute the query
    $create_part_query = mysqli_query($connection, $query);

    // Check if the query was successful
    if (!$create_part_query) {
        // If the query failed, handle the error
        $error_message = mysqli_error($connection);
        error_log("MySQL Error: " . $error_message);
        echo "<p class='bg-danger text-white p-3'>Error creating part: " . $error_message . "</p>";
    } else {
        // The query executed successfully, show success message
        echo "<p class='bg-info text-danger p-3'>Part Created. <a href='parts.php?model_id={$model_id}&model={$model}'>View Parts</a></p>";
    }
}

// Handle the cancel button, redirect to the parts page with model_id and model parameters
if (isset($_POST['cancel'])) {
    header("Location: parts.php?model_id={$model_id}&model={$model}");
}
?>

<form action="" method="post" enctype="multipart/form-data">

    <div class="form-group">
        <label for="model">Model Name</label>
        <input type="text" class="form-control" name="model" value="<?php echo $model; ?>" disabled>
    </div>
    <br>

    <div class="form-group">
       <label for="part_id">Parts</label>
    </div>
    <div>
       <select name="part_id" id="part_id" onchange="updatePartModel()">           
            <?php //CHANGE CATEGORY ID
                $query = "SELECT distinct P.product_id, P.model, P.status, PD.name FROM product P INNER JOIN product_description PD ON P.product_id = PD.product_id  WHERE P.status = 1 ORDER BY P.model";
                $select_products = mysqli_query($connection, $query);    
                while($row = mysqli_fetch_assoc($select_products)) {
                    $part_id = $row['product_id'];
                    $part_model = $row['model'];
                    $part_name = $row['name'];                
                    echo "<option value='{$part_id}' data-model='{$part_model}'>{$part_model} - {$part_name}</option>";
                }
            ?> 
       </select>
       <input type="hidden" name="part_model" id="part_model">
    </div>
    <br>

    <div class="form-group">
        <label for="description">Description</label>
        <input type="text" class="form-control" name="description">
    </div>
    <br>

    <div class="form-group">
        <label for="grid_column_start">Grid Column Start</label>
        <input type="text" class="form-control" name="grid_column_start">
    </div>
    <br>

    <div class="form-group">
        <label for="grid_column_end">Grid Column End</label>
        <input type="text" class="form-control" name="grid_column_end">
    </div>
    <br>

    <div class="form-group">
        <label for="grid_row_start">Grid Row Start</label>
        <input type="text" class="form-control" name="grid_row_start">
    </div>
    <br>

    <div class="form-group">
        <label for="grid_row_end">Grid Row End</label>
        <input type="text" class="form-control" name="grid_row_end">
    </div>
    <br>

    <div class="form-group">
        <input class="btn btn-primary" type="submit" name="create_part" value="Create Part">
        <input class="btn btn-primary" type="submit" name="cancel" value="Cancel">
    </div>

</form>

<script>
function updatePartModel() {
    var partSelect = document.getElementById("part_id");
    var selectedOption = partSelect.options[partSelect.selectedIndex];
    var partModel = selectedOption.getAttribute("data-model");
    document.getElementById("part_model").value = partModel;
}
</script>
