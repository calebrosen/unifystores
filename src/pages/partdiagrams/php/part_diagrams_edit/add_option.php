<?php include "includes/db.php"; ?>
<?php include "includes/header.php"; ?>

<?php

    if (isset($_GET['model_id'],$_GET['model'],$_GET['part_id'],$_GET['part'])) {
        $model_id =  escape($_GET['model_id']);
        $model = escape($_GET['model']);
        $part_id =  escape($_GET['part_id']);
        $part = escape($_GET['part']);
    }

    if (isset($_POST['create_option'])) {

        // $part_id = $_POST['part_id'];
        $option_part_id = $_POST['option_part_id'];
        $description = $_POST['description'];
        $part_model = $_POST['part_model'];

        $query = "INSERT INTO part_diagrams_part_options (`model_id`, `part_id`, `option_part_id`, `option_model`, `description`) 
                  VALUES ('{$model_id}','{$part_id}','{$option_part_id}','{$part_model}','{$description}')";

        $create_option_query = mysqli_query($connection, $query);

        confirmQuery($create_option_query);

        $the_model_id = mysqli_insert_id($connection);


        echo "<p class='bg-info text-danger p-3'>Option Created. <a href='options.php?model_id={$model_id}&model={$model}&part_id={$part_id}&part={$part}'>View Options</a></p>";
    }

    if (isset($_POST['cancel'])) {
        header("Location: options.php?model_id={$model_id}&model={$model}&part_id={$part_id}&part={$part}");
    }

?>

<form action="" method="post" enctype="multipart/form-data">

    <div class="form-group">
        <!-- <label for="model_id">Model Id</label> -->
        <input type="text" class="form-control" name="model_id" value="<?php echo $model_id; ?>" hidden>
    </div>
    <br>

    <div class="form-group">
        <label for="model">Model Name</label>
        <input type="text" class="form-control" name="model" value="<?php echo $model; ?>" disabled>
    </div>
    <br>

    <div class="form-group">
       <!-- <label for="part_id">Part Id</label> -->
       <input type="text" class="form-control" name="model" value="<?php echo $part_id; ?>" hidden>
    </div>
    <br>

    <div class="form-group">
       <label for="part_id">Part</label>
       <input type="text" class="form-control" name="model" value="<?php echo $part; ?>" disabled>
    </div>
    <br>

    <div class="form-group">
       <label for="option_part_id">Option Parts</label>
    </div>
    <div>
       <select name="option_part_id" id="option_part_id" onchange="updatePartModel()">           
            <?php
                $query = "SELECT DISTINCT P.product_id, P.model, P.status, PD.name FROM oc_master.product P INNER JOIN oc_master.product_description PD ON P.product_id = PD.product_id WHERE P.status = 1 ORDER BY P.model";
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
        <input class="btn btn-primary" type="submit" name="create_option" value="Create Option">
        <input class="btn btn-primary" type="submit" name="cancel" value="Cancel">
    </div>

</form>

<script>
function updatePartModel() {
    var partSelect = document.getElementById("option_part_id");
    var selectedOption = partSelect.options[partSelect.selectedIndex];
    var partModel = selectedOption.getAttribute("data-model");
    document.getElementById("part_model").value = partModel;
}
</script>