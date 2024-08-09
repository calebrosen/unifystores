<?php include "includes/db.php"; ?>
<?php include "includes/header.php"; ?>

<?php

    if (isset($_POST['create_model'])) {

        $model = $_POST['model'];
        $model_name = $_POST['model_name'];
        $model_type = $_POST['model_type'];
        $model_image = $_POST['model_image'];

        $query = "INSERT INTO part_diagrams_models (model, model_name, model_type, model_img_src) VALUES ('{$model}','{$model_name}','{$model_type}','{$model_image}')";

        $create_model_query = mysqli_query($connection, $query);

        confirmQuery($create_model_query);

        $the_model_id = mysqli_insert_id($connection);


        echo "<p class='bg-success'>Model Created. <a href='index.php'>View Models</a></p>";
    }

    if (isset($_POST['cancel'])) {
        header("Location: index.php");
    }

?>

<form action="" method="post" enctype="multipart/form-data">

    <div class="form-group">
        <label for="model">Model</label>
        <input type="text" class="form-control" name="model">
    </div>
    <br>

    <div class="form-group">
        <label for="model_name">Model Name</label>
        <input type="text" class="form-control" name="model_name">
    </div>
    <br>

    <div class="form-group">
        <div>
            <label for="model_type">Model Type</label>
        </div>
        <select name="model_type">
            <option value="Built-In">Built-In</option>
            <option value="Portable">Portable</option>
            <option value="Post-Mount">Post-Mount</option>
        </select>
    </div>
    <br>

    <div class="form-group">
        <label for="model_image">Model Image</label>
        <input type="text" class="form-control " name="model_image">
    </div>
    <br>

    <div class="form-group">
        <input class="btn btn-primary" type="submit" name="create_model" value="Create Model">
        <input class="btn btn-primary" type="submit" name="cancel" value="Cancel">
    </div>

</form>

