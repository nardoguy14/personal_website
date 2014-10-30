<?php session_start(); ?>

<!DOCTYPE html>
<html>
<head>
    <title>MedAssist Homepage</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <link href="css/tableborder.css" rel="stylesheet">

    <? include("functionss.js"); ?>
</head>
<body>
    <!-- start of the hearder nav bar -->
   <?php include("header.html"); ?>

    <form id = "settings_form">
        <div class="container">
            <div class="row">
                <div >
                    <div class="panel panel-default">
                        <div class="panel-body">
                            <div class="page-header">
                                <h3>Glucose Value Histogram</h3>
                            </div>

                            <table class="table table-borderless ">
                                <tr>
                                    <td>
                                         <label> <center>Low Value:    </center></label>
                                    </td>
                                    <td>
                                       <input id = "low_setting_holder" name = "low_setting_value" type="text" class="form-control" placeholder="mg/dl">
                                    </td>
                                     <td>
                                        <label><center> High Value: </center></label>
                                    </td>
                                    <td>
                                        <input id = "high_setting_holder" name = "high_setting_value"type="text" class="form-control" placeholder="mg/dl">
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label> <center>Bin size:    </center></label>
                                    </td>
                                    <td>
                                        <input id = "binsize_holder" name = "binsize" type="text" class="form-control" placeholder="#">
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>



            <button style = "float: right;" type="button" class="btn btn-primary" id = "save_settings_button">Save Settings</button>
        </div>
    </form>
           
           

        
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script src="js/bootstrap.js"></script>

</body>
</html>