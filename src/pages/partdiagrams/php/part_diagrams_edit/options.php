<?php include "includes/db.php"; ?>
<?php include "includes/header.php"; ?>

<div id="wrapper">
    <?php
    if (isset($_GET['model_id'], $_GET['model'], $_GET['part_id'], $_GET['part'])) {
        $model_id = $_GET['model_id'];
        $model = $_GET['model'];
        $part_id = $_GET['part_id'];
        $part = $_GET['part'];

        // $query = "SELECT * FROM part_diagrams_part_options WHERE model_id = {$model_id} AND part_id = {$part_id}";

        $query = "SELECT DISTINCT O.id, O.option_part_id, O.model_id, O.description, P.model
        FROM  part_diagrams_part_options O 
        INNER JOIN oc_master.product P ON P.product_id = O.option_part_id 
        INNER JOIN oc_master.product_description PD ON PD.product_id = P.product_id 
        WHERE O.part_id = {$part_id} AND O.model_id = {$model_id}";

        $select_options_query = mysqli_query($connection, $query);

        if (!$select_options_query) {
            die('Query Failed' . mysqli_error($connection));
        }

        $count_options = mysqli_num_rows($select_options_query);

    ?>

        <h1>Part Diagrams Edit Application</h1>
        <h2>Options List of Model: <?php echo $model ?> and Part: <?php echo $part ?></h2>
        <?php
        if ($count_options <= 0) {
            echo "<a class='btn btn-primary text-nowrap' href='./parts.php?model_id={$model_id}&model={$model}' style='float: left;'> < Back </a>";
            echo str_repeat('&nbsp;', 5);
            echo "<a class='btn btn-primary text-nowrap' href='source.php?source=add_option&model_id={$model_id}&model={$model}&part_id={$part_id}&part={$part}'> + Add New </a>";
            echo "<br>";
            echo "<br>";
            echo "<br>";
            echo "<div><strong>There is no options related with Model: $model and Part: $part</strong></div>";
        } else {
        ?>
            <table class="table table-bordered table-striped table-hover text-nowrap text-center">
                <thead>
                    <tr>
                        <!-- <th>Model Id</th> -->
                        <th>Model</th>
                        <!-- <th>Part Id</th> -->
                        <th>Part Name</th>
                        <!-- <th>Option Part Id</th> -->
                        <th>Option Part Name</th>
                        <th>Description</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
        <?php
                echo "<a class='btn btn-primary text-nowrap' href='./parts.php?model_id={$model_id}&model={$model}' style='float: left;'> < Back </a>";
                echo str_repeat('&nbsp;', 5);
                echo "<a class='btn btn-primary text-nowrap' href='source.php?source=add_option&model_id={$model_id}&model={$model}&part_id={$part_id}&part={$part}'> + Add New </a>";
                echo "<h5 style='float: right;'>Options Count : {$count_options}</h5>";
            }

            while ($row = mysqli_fetch_array($select_options_query)) {
                $id = $row['id'];
                $model_id = $model_id;
                $model = $model;
                $part_id = $part_id;
                $part = $part;
                $option_part_id = $row['option_part_id'];
                $option_part = $row['model'];
                $description = $row['description'];
                echo "<tr>";
                // echo "<td>$model_id</td>";
                echo "<td>$model</td>";
                // echo "<td>$part_id</td>";
                echo "<td>$part</td>";
                // echo "<td>$option_part_id</td>";
                echo "<td>$option_part</td>";
                echo "<td>$description</td>";
                echo "<td><a class='btn btn-info' href='source.php?source=edit_option&part_id={$part_id}&model_id={$model_id}&option_part_id={$option_part_id}'>Edit</a></td>";
                ?>
                <form method="post" onSubmit="return confirm('Are You Sure Want To Delete This Option?')">
                        <input type="hidden" name="id" value="<?php echo $id ?>">
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

    if (isset($_POST['delete'])) {

        $the_id = escape($_POST['id']);

        $query = "DELETE FROM part_diagrams_part_options WHERE id = {$the_id}";
        $delete_query = mysqli_query($connection, $query);
        header("Location: options.php?model_id={$model_id}&model={$model}&part_id={$part_id}&part={$part}");
    }
?>