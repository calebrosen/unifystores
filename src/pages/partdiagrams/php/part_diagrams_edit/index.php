<?php include "includes/db.php"; ?>
<?php include "includes/header.php"; ?>

<div id="wrapper">
    <h1>Part Diagrams Edit Application</h1>
    <h2>Models List</h2>
        <table class="table table-bordered table-striped table-hover text-nowrap text-center">
            <thead>
                <tr>
                    <!-- <th>Model Id</th> -->
                    <th>Model</th>
                    <th>Model Name</th>
                    <th>Model Type</th>
                    <th>Model Image Url</th>
                    <th>View Parts</th>
                    <th>Edit</th>
                    <!-- <th>Delete</th> -->
                </tr>
            </thead>
            <tbody>

                <?php

                    if (isset($_POST['delete'])) {

                        $the_model_id = escape($_POST['model_id']);

                        $query = "DELETE FROM part_diagrams_models WHERE model_id = {$the_model_id} ";
                        $delete_query = mysqli_query($connection, $query);
                        header("Location: /part_diagrams/part_diagrams_edit/index.php");
                    }
                ?>

                <?php

                    $query = "SELECT * FROM part_diagrams_models ORDER BY model ASC ";
                    $select_models = mysqli_query($connection, $query);

                    $count_models = mysqli_num_rows($select_models);

                    echo "<a class='btn btn-primary text-nowrap' href='source.php?source=add_model' style='float: left;'> + Add New </a>";
                    echo "<h5 style='float: right;'>Models Count : {$count_models}</h5>";

                    while ($row = mysqli_fetch_assoc($select_models)) {
                        $model_id = $row['model_id'];
                        $model = $row['model'];
                        $model_name = $row['model_name'];
                        $model_type = $row['model_type'];
                        $model_img_src = $row['model_img_src'];
                        echo "<tr>";
                        // echo "<td>$model_id</td>";
                        echo "<td>$model</td>";
                        echo "<td>$model_name</td>";
                        echo "<td>$model_type</td>";
                        echo "<td>$model_img_src</td>";
                        echo "<td><a class='btn btn-primary text-nowrap' href='./parts.php?model_id={$model_id}&model={$model}'>View Parts</a></td>";
                        echo "<td><a class='btn btn-info' href='source.php?source=edit_model&model_id={$model_id}'>Edit</a></td>";
                    ?>
                        <form method="post" onSubmit="return confirm('Are You Sure Want To Delete This Model?')">

                            <input type="hidden" name="model_id" value="<?php echo $model_id ?>">

                    <!-- <?php
                        echo '<td><input class="btn btn-danger" type="submit" name="delete" value="Delete"></td>';
                    ?> -->
                        </form>
                    <?php
                        }   
                    ?>
            </tbody>
        </table>
</div>

