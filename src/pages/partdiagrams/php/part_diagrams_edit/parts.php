<?php include "includes/db.php"; ?>
<?php include "includes/header.php"; ?>

<div id="wrapper">
            <?php
            if (isset($_GET['model_id'], $_GET['model'])) {
                $the_model_id = $_GET['model_id'];
                $the_model = $_GET['model'];

                $query = "SELECT PD.id, PD.model_id, PM.model, PD.part_id, P.model AS part, PDES.tag, PD.description, PD.grid_column_start, PD.grid_column_end, PD.grid_row_start, PD.grid_row_end 
                          FROM part_diagrams_model_part_relations PD 
                          INNER JOIN product P ON PD.part_id = P.product_id
                          INNER JOIN product_description PDES ON PD.part_id = PDES.product_id
                          INNER JOIN part_diagrams_models PM ON PD.model_id = PM.model_id 
                          WHERE PD.model_id = {$the_model_id}
                          ORDER BY P.model";
                $select_parts_query = mysqli_query($connection, $query);

                if (!$select_parts_query) {
                    die('Query Failed' . mysqli_error($connection));
                }

                $count_parts = mysqli_num_rows($select_parts_query);

            ?>

          

                <h1>Part Diagrams Edit Application</h1>
                <h2>Parts List of <?php echo $the_model ?></h2>
                <table class="table table-bordered table-striped table-hover text-nowrap text-center">
                    <thead>
                        <tr>
                            <!-- <th>Model Id</th> -->
                            <th>Model</th>
                            <!-- <th>Part Id</th> -->
                            <th>Part Name</th>
                            <th>Part Tag</th>
                            <th>Description</th>
                            <th>Grid Column Start</th>
                            <th>Grid Column End</th>
                            <th>Grid Row Start</th>
                            <th>Grid Column End</th>
                            <th>View Options</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>


                    <?php

                    echo "<a class='btn btn-primary text-nowrap' href='./index.php' style='float: left;'> < Back </a>";
                    echo str_repeat('&nbsp;', 5);
                    echo "<a class='btn btn-primary text-nowrap' href='source.php?source=add_part&model_id={$the_model_id}&model={$the_model}'> + Add New </a>";
                    // echo "<p class='bg-info text-danger p-3 .error' style='display:none;'>'You can not delete any part which includes options. You should delete options first...'</p>";
                    echo "<h5 style='float: right;'>Parts Count : {$count_parts}</h5>";

                    while ($row = mysqli_fetch_array($select_parts_query)) {
                        $id = $row['id'];
                        $model_id = $row['model_id'];
                        $model = $row['model'];
                        $part_id = $row['part_id'];
                        $part = $row['part'];
                        $tag = $row['tag'];
                        $description = $row['description'];
                        $grid_column_start = $row['grid_column_start'];
                        $grid_column_end = $row['grid_column_end'];
                        $grid_row_start = $row['grid_row_start'];
                        $grid_row_end = $row['grid_row_end'];
                        echo "<tr>";
                        // echo "<td>$model_id</td>";
                        echo "<td>$model</td>";
                        // echo "<td>$part_id</td>";
                        echo "<td>$part</td>";
                        echo "<td>$tag</td>";
                        echo "<td>$description</td>";
                        echo "<td>$grid_column_start</td>";
                        echo "<td>$grid_column_end</td>";
                        echo "<td>$grid_row_start</td>";
                        echo "<td>$grid_row_end</td>";
                        echo "<td><a class='btn btn-primary text-nowrap' href='./options.php?model_id={$model_id}&model={$model}&part_id={$part_id}&part={$part}'>View Options</a></td>";
                        echo "<td><a class='btn btn-info' href='source.php?source=edit_part&part_id={$part_id}&model_id={$model_id}'>Edit</a></td>";
                    ?>
                        <form method="post" onSubmit="return confirm('Are You Sure Want To Delete This Part?')">

                        <input type="hidden" name="id" value="<?php echo $id ?>">
                        <input type="hidden" name="model_id" value="<?php echo $model_id ?>">
                        <input type="hidden" name="part_id" value="<?php echo $part_id ?>">

                    <?php
                        echo '<td><input class="btn btn-danger" type="submit" name="delete" value="Delete"></td>';
                        echo "</tr>";
                    ?>
                    </form>
                    <?php    
                    }
                }
                    ?>
                    </tbody>
                </table>
</div>

<?php

    // if this part has options we can not delete it unless delete option(s) first...
    if (isset($_POST['delete'])) {

        $the_id = escape($_POST['id']);
        $the_model_id = escape($_POST['model_id']);
        $the_part_id = escape($_POST['part_id']);

        $query = "SELECT * FROM part_diagrams_part_options WHERE model_id = $the_model_id AND part_id = $the_part_id";
        $select_parts_options_query = mysqli_query($connection, $query);

        if (!$select_parts_options_query) {
            die('Query Failed' . mysqli_error($connection));
        }

        $count_parts_options = mysqli_num_rows($select_parts_options_query);

        if ($count_parts_options > 0) {
            echo '<script>alert("You can not delete any part which includes options. You should delete options first...")</script>';
        } else {
            
            $query = "DELETE FROM part_diagrams_model_part_relations WHERE id = {$the_id} ";
            $delete_query = mysqli_query($connection, $query);
            header("Location: parts.php?model_id={$model_id}&model={$model}");
        }
    }
?>

