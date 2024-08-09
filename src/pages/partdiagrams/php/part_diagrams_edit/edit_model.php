<?php include "includes/db.php"; ?>
<?php include "includes/header.php"; ?>

<?php

    if (isset($_GET['model_id'])) {

        $the_model_id =  escape($_GET['model_id']);
    }

    $query = "SELECT * FROM part_diagrams_models WHERE model_id = $the_model_id  ";
    $select_models_by_id = mysqli_query($connection, $query);

    while ($row = mysqli_fetch_assoc($select_models_by_id)) {
        $model_id = $row['model_id'];
        $model = $row['model'];
        $model_name = $row['model_name'];
        $model_type = $row['model_type'];
        $model_img_src = $row['model_img_src'];
    }


    if (isset($_POST['update_model'])) {

        $model = escape($_POST['model']);
        $model_name = escape($_POST['model_name']);
        $model_type = escape($_POST['model_type']);
        $model_img_src = escape($_POST['model_img_src']);

        $query = "UPDATE part_diagrams_models SET ";
        $query .= "model  = '{$model}', ";
        $query .= "model_name = '{$model_name}', ";
        $query .= "model_type = '{$model_type}', ";
        $query .= "model_img_src = '{$model_img_src}' ";
        $query .= "WHERE model_id = {$the_model_id} ";
        $update_model = mysqli_query($connection, $query);
        
        confirmQuery($update_model);
        echo "<p class='bg-success'>Model Updated. <a href='index.php'>View Models</a></p>";
    }

    if (isset($_POST['cancel'])) {
        header("Location: /part_diagrams/part_diagrams_edit/index.php");
    }

?>

<form action="" method="post" enctype="multipart/form-data">

    <div class="form-group">
        <label for="model">Model</label>
        <input value="<?php echo $model; ?>" type="text" class="form-control" name="model">
    </div>
    <br>

    <div class="form-group">
        <label for="model_name">Model Name</label>
        <input value="<?php echo $model_name; ?>" type="text" class="form-control" name="model_name">
    </div>
    <br>

    <div class="form-group">
        <div>
            <label for="model_type">Model Type</label>
        </div>
        <select name="model_type">
            <option value='<?php echo $model_type ?>'><?php echo $model_type; ?></option>

            <?php
                switch ($model_type) {
                    case 'Built-In';
                        echo "<option value='Portable'>Portable</option>";
                        echo "<option value='Post-Mount'>Post-Mount</option>";
                        break;        
                    case 'Portable';
                        echo "<option value='Built-In'>Built-In</option>";
                        echo "<option value='Post-Mount'>Post-Mount</option>";
                        break;
                    case 'Post-Mount';
                        echo "<option value='Built-In'>Built-In</option>";
                        echo "<option value='Portable'>Portable</option>";
                        break;
                }
            ?>

        </select>
    </div>
    <br>

    <div class="form-group">
        <label for="model_img_src">Model Image</label>
        <input value="<?php echo $model_img_src; ?>" class="form-control " name="model_img_src">
    </div>
    <br>

    <div class="form-group">
        <input class="btn btn-primary" type="submit" name="update_model" value="Update Model">
        <input class="btn btn-primary" type="submit" name="cancel" value="Cancel">
    </div>

</form>

