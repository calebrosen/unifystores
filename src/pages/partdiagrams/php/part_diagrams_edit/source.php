<div id="wrapper">

    <div id="page-wrapper">

        <div class="container-fluid">

            <!-- Page Heading -->
            <div class="row">
                <div class="col-lg-12">

                    <?php

                        if (isset($_GET['source'])) {
                            $source = $_GET['source'];
                        } else {
                            $source = '';
                        }

                        switch ($source) {
                            case 'add_model';
                                echo '<h2 class="page-header">Create Model</h2>';
                                include "add_model.php";
                                break;
                            case 'edit_model';
                                echo '<h2 class="page-header">Update Model</h2>';
                                include "edit_model.php";
                                break;
                            case 'add_part';
                                echo '<h2 class="page-header">Create Part</h2>';
                                include "add_part.php";
                                break;
                            case 'edit_part';
                                echo '<h2 class="page-header">Update Part</h2>';
                                include "edit_part.php";
                                break;
                            case 'add_option';
                                echo '<h2 class="page-header">Create Option</h2>';
                                include "add_option.php";
                                break;
                            case 'edit_option';
                                echo '<h2 class="page-header">Update Option</h2>';
                                include "edit_option.php";
                                break;
                            default:
                                include "index.php";
                                break;
                        }

                    ?>

                </div>
            </div>
            <!-- /.row -->

        </div>
        <!-- /.container-fluid -->

    </div>
    <!-- /#page-wrapper -->
