<?php include "includes/db.php"; ?>
<?php include "includes/header.php"; ?>

<?php

    if (isset($_GET['part_id'], $_GET['model_id'])) {
        $the_part_id =  escape($_GET['part_id']);
        $the_model_id =  escape($_GET['model_id']);
    }

    $query = "SELECT PD.id, PD.model_id, PM.model, PD.part_id, P.model AS part, PD.description, PD.grid_column_start, PD.grid_column_end, PD.grid_row_start, PD.grid_row_end 
              FROM part_diagrams_model_part_relations PD 
              INNER JOIN oc_master.product P ON PD.part_id = P.product_id
              INNER JOIN oc_master.part_diagrams_models PM ON PD.model_id = PM.model_id 
              WHERE PD.model_id = $the_model_id AND PD.part_id = $the_part_id";

    $select_parts_by_id = mysqli_query($connection, $query);

    while ($row = mysqli_fetch_assoc($select_parts_by_id)) {
        $id = $row['id'];
        $model_id = $row['model_id'];
        $model = $row['model'];
        $part_id = $row['part_id'];
        $part = $row['part'];
        $description = $row['description'];
        $grid_column_start = $row['grid_column_start'];
        $grid_column_end = $row['grid_column_end'];
        $grid_row_start = $row['grid_row_start'];
        $grid_row_end = $row['grid_row_end'];
    }


    if (isset($_POST['update_part'])) {

        $description = $_POST['description'];
        $grid_column_start = $_POST['grid_column_start'];
        $grid_column_end = $_POST['grid_column_end'];
        $grid_row_start = $_POST['grid_row_start'];
        $grid_row_end = $_POST['grid_row_end'];

        $query = "UPDATE part_diagrams_model_part_relations SET 
                  description = '{$description}', 
                  grid_column_start = '{$grid_column_start}',
                  grid_column_end = '{$grid_column_end}',
                  grid_row_start = '{$grid_row_start}',
                  grid_row_end = '{$grid_row_end}'
                  WHERE id = $id";

        $update_model = mysqli_query($connection, $query);

        confirmQuery($update_model);

        echo "<p class='bg-info text-danger p-3'>Part Updated. <a href='parts.php?model_id={$model_id}&model={$model}'>View Parts</a></p>";
    }

    if (isset($_POST['cancel'])) {
        header("Location: parts.php?model_id={$model_id}&model={$model}");
    }

?>


<form action="" method="post" enctype="multipart/form-data">

    <!-- <div class="form-group">
        <label for="id">Id</label>
        <input value="<?php echo $id; ?>" type="text" class="form-control" name="id" value="<?php echo $id; ?>" disabled>
    </div>
    <br> -->

    <!-- <div class="form-group">
        <label for="model_id">Model Id</label>
        <input type="text" class="form-control" name="model_id" value="<?php echo $model_id; ?>" disabled>
    </div>
    <br> -->

    <div class="form-group">
        <label for="model">Model Name</label>
        <input type="text" class="form-control" name="model" value="<?php echo $model; ?>" disabled>
    </div>
    <br>

    <!-- <div class="form-group">
       <label for="part_id">Part Id</label>
       <input type="text" class="form-control" name="model" value="<?php echo $part_id; ?>" disabled>
    </div>
    <br> -->

    <div class="form-group">
       <label for="part_id">Part</label>
       <input type="text" class="form-control" name="model" value="<?php echo $part; ?>" disabled>
    </div>
    <br>

    <div class="form-group">
        <label for="description">Description</label>
        <input type="text" class="form-control" name="description" value="<?php echo $description; ?>">
    </div>
    <br>

    <div class="form-group">
        <label for="grid_column_start">Grid Column Start</label>
        <input type="text" class="form-control" name="grid_column_start" value="<?php echo $grid_column_start; ?>">
    </div>
    <br>

    <div class="form-group">
        <label for="grid_column_end">Grid Column End</label>
        <input type="text" class="form-control" name="grid_column_end" value="<?php echo $grid_column_end; ?>">
    </div>
    <br>

    <div class="form-group">
        <label for="grid_row_start">Grid Row Start</label>
        <input type="text" class="form-control" name="grid_row_start" value="<?php echo $grid_row_start; ?>">
    </div>
    <br>

    <div class="form-group">
        <label for="grid_row_end">Grid Row End</label>
        <input type="text" class="form-control" name="grid_row_end" value="<?php echo $grid_row_end; ?>">
    </div>
    <br>

    <div class="form-group">
        <input class="btn btn-primary" type="submit" name="update_part" value="Update Part">
        <input class="btn btn-primary" type="submit" name="cancel" value="Cancel">
    </div>

</form>