<?php 
session_start(); ?>
<!DOCTYPE html>
<html>
<head>
    <title>Diaweb</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    

<? include("functionss.js"); ?>



</head>
<body>
   
    <!-- start of the hearder nav bar -->
    <?php include("header.html"); ?>




    <!-- Start of the jumbotron -->
    <center>
        <div id = "intro" class="container">

            <div class="jumbotron">
                <h1>A Diabetes Glucose Dynamics Webapp</h1>
                <p>
                    Login with user:test1 password:test1 for a demo or download the <a href="sample.txt" >sample data</a>.
                </p>

               
            <p><font size="3" color="blue">Please Login/Register and then Navigate to other pages</font></p>
            </br><p>Is capable with DEXCOM G4 csv files for data input.</p>


                <a href="#login" class="btn btn-default " data-toggle="modal" id = "logintomodal">Login</a>
                <a href="#register" class="btn btn-info" data-toggle="modal" id = "registertomodal">Register</a>

            </div>

        </div>
    </center>

    <!--end of intro jumbotron -->

    <!--basic upload box -->

    <div id = "uploadbox" class = "oli">
        <span class="btn btn-success fileinput-button">
            <i class="glyphicon glyphicon-plus"></i>
            <span>Select files...</span>
            <!-- The file input field used as target for the file upload widget -->
            <input id="fileupload" type="file" name="files[]" multiple>
        </span>
        <br>
        <br>
        <!-- The global progress bar -->
        <div id="progress" class="progress">
            <div class="progress-bar progress-bar-success"></div>
        </div>

    </div>

    <!-- end upf basic upload box -->



<div id = "time_header">
   
</div>

<table style="width:100%;">
    <tr class ="chartRow" >
        <td style = "width:50%;">
            <div id="container" class = "oli graph" style="height: 400px;"></div>
        </td>
        <td style = "width:50%;">
            <div id="container2" class = "oli graph" style="height: 400px;"></div>
        </td>
    </tr>
    <tr class = "chartRow">
        <td style = "width:50%;">
            <div id="container3" class = "oli graph" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
        </td>
        <td style = "width:50%;">
            <div id="container4" class = "oli graph" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
        </td>

    </tr>
    <tr class = "chartRow">
        <td style = "width:50%;">
            <div id="container5" class = "oli graph" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
        </td>
        <td style = "width:50%;">
            <div id="container6" class = "oli graph" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
        </td>
    </tr>
<table>
<form id = "updaterange" class="form-horizontal" >
    <table class = "table oli ">
        <tr>
                <td>
                     <div class = "graph"><h5><center> Date </center></h5><br></div>
                    <div class='input-group date graph' id='datetimepicker5' name = "date" data-date-format="YYYY-MM-DD">
                        <input type='text' name = "date"class="form-control" />
                        <span class="input-group-addon"><span class="glyphicon glyphicon-time"></span>
                        </span>
                    </div>
                </td>
                <td>
                     <div class = "graph"><h5><center> From Time </center></h5><br></div>
                    <div class='input-group date graph' name = "fromtime" id='datetimepicker4'>
                        <input type='text' name = "fromtime" class="form-control" />
                        <span class="input-group-addon"><span class="glyphicon glyphicon-time"></span>
                        </span>
                    </div>
                </td>

                <td>
                    <div class = "graph"><h5><center> To Time </center></h5><br></div>
                    <div class='input-group date graph' name = "totime" id='datetimepicker3'>
                        <input type='text' name = "totime"class="form-control" />
                        <span class="input-group-addon"><span class="glyphicon glyphicon-time"></span>
                        </span>
                    </div>
                </td>

                <td>
                    <button class="btn btn-primary graph" id = "updaterangebutton" >Submit</button>
                </td>
        </tr>
    </table>
</form>


<div id = "stats" class="oli graph"> 
    <table class="table table-striped">
        <tr>
            <td>
                <center><h5>  <div id = "low_limit"></div> </h5></center>
            </td>

            <td>
                <center> <h5> <div id = "in_range"></div></h5></center>
            </td>

            <td>
                <center><h5> <div id = "high_limit"></div></h5></center>
            </td>

            <td>
                <center> <h5>Average</h5></center>
            </td>

            <td>
                <center><h5> Variance</h5></center>
            </td>
            <td>
                <center><h5> Standard Deviation</h5></center>
            </td>

        </tr>

        <tr>
            <td>
                <center><div id = "percentagelow"> </div> </center>
            </td>
            <td>
                <center><div id = "percentagein"> </div> </center>
            </td>
            <td>
                <center><div id = "percentagehigh"> </div> </center>
            </td>
            <td>
                <center><div id = "average"> </div> </center>
            </td>
            <td>
                <center><div id = "variance"> </div> </center>
            </td>
            <td>
                <center><div id = "stdev"> </div> </center>
            </td>
        </tr>


    </table>



</div>



            



















    

    <!-- The Modal for Register clicking -->
    <div class="modal fade" id="register" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <form id = "form1" class="form-horizontal" >
                    <div class="modal-header">
                        <h4>Register for Diaweb</h4>
                    </div>
                    <div class="modal-body">

                        <div class="form-group">

                            <label for="contact-name" class="col-lg-2 control-label">Name:</label>
                            <div class="col-lg-10">

                                <input type="text" class="form-control" id="contact-name" name = "fullname" placeholder="Full Name">

                            </div>

                        </div>


                        <div class="form-group">

                            <label for="contact-name" class="col-lg-2 control-label">Username:</label>
                            <div class="col-lg-10">

                                <input type="text" class="form-control" id="user-name" name = "username" placeholder="User Name">

                            </div>

                        </div>

                        <div class="form-group">

                            <label for="contact-email" class="col-lg-2 control-label">Email:</label>
                            <div class="col-lg-10">

                                <input type="email" class="form-control" id="contact-email" name = "email" placeholder="you@example.com">

                            </div>

                        </div>


                          <div class="form-group">

                            <label for="contact-email" class="col-lg-2 control-label">Password:</label>
                            <div class="col-lg-10">

                                <input type="password" class="form-control" id="pass" name = "password" placeholder="******">

                            </div>

                        </div>

                        


                    </div>

                    <div class="modal-footer">
                        <a class="btn btn-default" data-dismiss="modal">Close</a>
                        <button class="btn btn-primary" id = "submit1" type = "submit">Register</button>
                    </div>
                </form>

            </div>
        </div>
    </div>


    <div class="modal fade" id="login" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <form class="form-horizontal" id ="loginform1">
                    <div class="modal-header">
                        <h4>Login</h4>
                    </div>
                    <div id = "content1" class="modal-body">

                        <div class="form-group">

                            <label for="User-name" class="col-lg-2 control-label">Login:</label>
                            <div class="col-lg-10">

                                <input type="text" class="form-control" id="contact-name" name = "username" placeholder="Your User Name">

                            </div>

                        </div>

                        <div class="form-group">

                            <label for="user-password" class="col-lg-2 control-label">Password:</label>
                            <div class="col-lg-10">

                                <input type="password" class="form-control" id="user-password" name = "password" placeholder="">

                            </div>

                        </div>
          

            

                    </div>
                    <div class="modal-footer">
                        <a class="btn btn-default" data-dismiss="modal">Close</a>
                        <button class="btn btn-primary" id = "login1"type="submit">Login</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="modal fade" id="invalidrange" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Error</h4>
                </div>
               
                 <div class="modal-body">
                    <p> Sorry that's not a valid Range.</p>
                 </div>
                <div class="modal-footer">
                        <a class="btn btn-default" data-dismiss="modal">Close</a>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="nodata" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Welcome!</h4>
                </div>
               
                 <div class="modal-body">
                    <p> Get started by uploading a data set to display graphs.</p>
                 </div>
                <div class="modal-footer">
                        <a class="btn btn-default" data-dismiss="modal">Close</a>
                </div>
            </div>
        </div>
    </div>








</body>
</html>