<?php

// require('model/database.php'); 
require('model/queries.php');

$models = select_models();
$parts = [];

function debug_to_console($data) {
    $output = $data;    
    if (is_array($output))
        $output = implode(',', $output);
    
    echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
}

if(isset($_POST['models'])) {
    global $parts;
    $selectedOption = $_POST['models'];
    print($selectedOption);
    $parts = select_model($selectedOption);
    // echo "<script type='text/javascript'>jsFunction($parts);</script>";
    // echo $parts;
}

?>

<!DOCTYPE html>
<html>

    <?php include('templates/header.php'); ?>

    <form method="POST">
        <label>Select a Model</label>
        <br>
        <select name="models">
            <option value="<?php echo 0;?>">
                <?php echo "Select a Model";?>
            </option>
            <?php
                foreach ($models as $model) {
            ?>
                <option value="<?php echo $model['model_id'];?>">
                    <?php echo htmlspecialchars($model['model_name']);?>
                </option>
            <?php
                }
            ?>
        </select>
        <br>
        <input type="submit" value="submit" name="submit">
    </form>

    <!-- <?php
        // some php stuff
    ?>
    <script type="text/javascript">jsFunction();</script> -->


    <div class="image_container">
        <div class="grillName"><span>Grill Name</span></div>
        <div class="imageMap__container">
            <div class="ribbon ribbon-top-left"><span>Built-In</span></div>
 <img class="img-thumbnail" id="explodedImage" src="./images/c430s.jpg" alt="Exploded View" />           
             <div class="markers"
                style="grid-column-start:10; grid-column-end: 11; grid-row-start: 10; grid-row-end: 11">
                <span class="badge">badge</span>
            </div> 

        </div>
    </div>
    <br>

    <!-- <script type="text/javascript" src="script.js"> </script> -->

    <script type="text/javascript">
        function jsFunction(parts) {
            console.log(parts);
            let container = document.querySelector(".imageMap__container");
            parts.map((part, index) => {
                const marker = document.createElement("div")
                marker.classList = "markers";
                marker.style.position = "absolute";
                marker.dataset.id = index;
                marker.style = `grid-column-start:${part.grid_column_start}; grid-column-end: ${part.grid_column_start}; grid-row-start: ${part.gridRowStart}; grid-row-end: ${part.gridRowEnd}`
                container.appendChild(marker);
            });
        };
        jsFunction(<?php echo json_encode($parts);?>);
    </script>';

    <!-- <?php include('upload.php'); ?> -->
    <?php include('templates/footer.php'); ?>

</html>
