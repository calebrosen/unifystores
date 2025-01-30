<?php include "includes/db.php"; ?>
<?php include "includes/header.php"; ?>

<?php

    if (isset($_GET['part_id'], $_GET['model_id'], $_GET['option_part_id'])) {
        $the_part_id =  escape($_GET['part_id']);
        $the_model_id =  escape($_GET['model_id']);
        $the_option_part_id =  escape($_GET['option_part_id']);
    }

    $query = "SELECT O.id, O.model_id, PM.model, O.part_id, O.option_part_id, P.model AS option_part, O.description
              FROM part_diagrams_part_options O 
              INNER JOIN oc_master.product P ON O.part_id = P.product_id
              INNER JOIN part_diagrams_models PM ON O.model_id = PM.model_id 
              WHERE O.model_id = $the_model_id AND O.part_id = $the_part_id AND O.option_part_id = $the_option_part_id";

    $select_parts_by_id = mysqli_query($connection, $query);

    while ($row = mysqli_fetch_assoc($select_parts_by_id)) {
        $id = $row['id'];
        $model_id = $row['model_id'];
        $model = $row['model'];
        $part_id = $row['part_id'];
        $part = $row['option_part'];
        $option_part_id = $row['option_part_id'];
        $option_part = $row['option_part'];
        $description = $row['description'];
    }


    if (isset($_POST['update_option_part'])) {

        $option_part_id = $_POST['option_part_id'];
        $description = $_POST['description'];

        $query = "UPDATE part_diagrams_part_options SET 
                  option_part_id = '{$option_part_id}',
                  description = '{$description}' 
                  WHERE id = $id";

        $update_model = mysqli_query($connection, $query);

        confirmQuery($update_model);

        echo "<p class='bg-info text-danger p-3'>Option Updated. <a href='options.php?model_id={$model_id}&model={$model}&part_id={$part_id}&part={$part}'>View Options</a></p>";
    }

    if (isset($_POST['cancel'])) {
        header("Location: options.php?model_id={$model_id}&model={$model}&part_id={$part_id}&part={$part}");
    }

?>


<form action="" method="post" enctype="multipart/form-data">

    <!-- <div class="form-group">
        <label for="id">Id</label>
        <input type="text" class="form-control" name="id" value="<?php echo $id; ?>" disabled>
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
       <input type="text" class="form-control" name="part_id" value="<?php echo $part_id; ?>" disabled>
    </div>
    <br> -->

    <div class="form-group">
       <label for="part">Part</label>
       <input type="text" class="form-control" name="part" value="<?php echo $part; ?>" disabled>
    </div>
    <br>

    <div class="form-group">
       <label for="option_part_id">Option Parts</label>
    </div>
    <div>
       <select name="option_part_id">           
            <?php
                $query = "SELECT DISTINCT P.product_id, P.model, P.status, PD.name FROM oc_master.product P INNER JOIN oc_master.product_description PD ON P.product_id = PD.product_id WHERE P.status = 1 ORDER BY P.model";
                $select_products = mysqli_query($connection, $query);    
                while($row = mysqli_fetch_assoc($select_products)) {
                    $part_id = $row['product_id'];
                    $part_model = $row['model'];
                    $part_name = $row['name'];
                    if($part_id == $option_part_id) {
                        echo "<option selected value='{$part_id}'>{$part_model} - {$part_name}</option>";
                    } else {
                        echo "<option value='{$part_id}'>{$part_model} - {$part_name}</option>";
                    }              
                }
            ?> 
       </select>
    </div>
    <br>

    <div class="form-group">
        <label for="description">Description</label>
        <input type="text" class="form-control" name="description" value="<?php echo $description; ?>">
    </div>
    <br>

    <div class="form-group">
        <input class="btn btn-primary" type="submit" name="update_option_part" value="Update Option Part">
        <input class="btn btn-primary" type="submit" name="cancel" value="Cancel">
    </div>

</form>