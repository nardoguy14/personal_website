<?php session_start(); include('constants.php'); ?>
<script src="js/jquery-1.11.1.min.js"></script>
<script src="js/bootstrap.js"></script>
<script src="js/vendor/jquery.ui.widget.js"></script>
<script src="js/jquery.iframe-transport.js"></script>
<script src="js/jquery.fileupload.js"></script>
<script src="js/highcharts.js"></script>
<script src="js/modules/exporting.js"></script> 
<script type="text/javascript" src="js/moment.min.js"></script>
<script type="text/javascript" src="bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js"></script>
<link rel="stylesheet" href="bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css" />
<link href="css/styles.css" rel="stylesheet">
<link rel="stylesheet" href="css/jquery.fileupload.css">
<link href="css/bootstrap.min.css" rel="stylesheet">







<script language="JavaScript">
    var chart1;
    var chart2;
    var chart3;
    var chart4;
    var chart5;
    var chart6;
    
    var controllingChart;
    
    var defaultTickInterval = 5;
    var currentTickInterval = defaultTickInterval;

    
  $(document).ready(function(){

    //alert(location.href );
    

    $('#btn').click(function(){
                    unzoom();
                });
                
    var myPlotLineId = "myPlotLine";
     
    if( location.href === "<?php echo  WEBSITE1 ;?>" ||location.href === "<?php echo  WEBSITE2 ;?>"){
        $('#datetimepicker5').datetimepicker({
                        pickTime: false
                    });

        $('#datetimepicker4').datetimepicker({
                        pickDate: false
                    });

        $('#datetimepicker3').datetimepicker({
                        pickDate: false
                    });
    }


     $('.oli').hide();

     $("#newentrybut").hide();

   

    if( location.href === "<?php echo  WEBSITE1 ;?>"||location.href === "<?php echo  WEBSITE2 ;?>"){
        $(function () {
                'use strict';
                // Change this to the location of your server-side upload handler:
                var url = window.location.hostname === 'blueimp.github.io' ?
                            '//jquery-file-upload.appspot.com/' : 'server/php/';
                $('#fileupload').fileupload({
                    url: url,
                    dataType: 'json',
                    done: function (e, data) {
                        $.get("dexcom.php", json,  function( data ) {
                                alert("yo!");
                            });
                        
                        location.reload();
                    },
                    progressall: function (e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $('#progress .progress-bar').css(
                            'width',
                            progress + '%'
                        );
                    }
                }).prop('disabled', !$.support.fileInput)
                    .parent().addClass($.support.fileInput ? undefined : 'disabled');
         });
    }

       

        var un =  "<?php echo $_SESSION['username']; ?>";
        if(un != ""){
            $('.oli').show();
            $("#intro").hide();
            $("#registertomodal").hide();
            $("#logintomodal").hide();
            $("#topbarid").html("MedAssist: "+un);
            $("#itemsonnav").append("<li id = 'logout'><a href = '#'>Logout</a></li>");
            $("#logout").on("click", loggoutt);
            $("#newentrybut").show();
            $("#uploadbox").show();
            //alert(document.URL);

            
            //get user data

            if(location.href === "<?php echo  WEBSITE1 ;?>"||location.href === "<?php echo  WEBSITE2 ;?>"){
                var json = {};
                json["url"] = document.URL;
                json["action"] = "alldata";
                var result = $.ajax({type: "GET", url: 'test.php',data: json,

                    error: function(result, status, error) {
                  var err = eval("(" + result.responseText + ")");
                  alert(err.Message);
                    },
                async: false}).responseText;

                console.log(result);

                var glucose_values = Array();
                if(result !== ""){
                    var object = JSON.parse(result);
                    var glucose_values = object[0];

                    var first_time = glucose_values[0];
                    var last_time = glucose_values[glucose_values.length-1];
                    //alert(first_time[0]+ " "+ last_time[0]);

                    
                    var date1 = new Date(first_time[0]);
                    var date2 = new Date(last_time[0]);
                    
                     var timeresult = date1.toDateString() + " - " + date2.toDateString();
          

                    $("#time_header").empty().append("<h3><center>"+timeresult+"</center></h3>");

                    var rate_of_change_values = object[1];
                    var events = object[2];
                    var events = prepare2(events);
                }
            }


            //get settings for user
            var json = {};
            json["action"] = "get_settings";
            var settings_result = $.ajax({type: "GET", url: 'test.php',data: json,

                error: function(result, status, error) {
              var err = eval("(" + result.responseText + ")");
              alert(err.Message);
                },
            async: false}).responseText;

            var low_n_high_values = JSON.parse(settings_result);
            $("#low_setting_holder").val(low_n_high_values[0]);
            $("#high_setting_holder").val(low_n_high_values[1]);
            $("#binsize_holder").val(low_n_high_values[2]);


            
            
            if(location.href === "<?php echo  WEBSITE1 ;?>"||location.href === "<?php echo  WEBSITE2 ;?>"){
                if(glucose_values.length !== 0 )
                chart1(chart1,glucose_values, chart2, rate_of_change_values,events, chart3, chart4, chart5, chart6, 30*1000, low_n_high_values);
                
                if(glucose_values.length === 0){
                    $(".graph").hide();
                    $("#nodata").modal('show');
                }

            }
           
        }

         function  loggoutt(){
        
            
            
            var json = {};
            json["action"] = "logout";
            
                $.get("test.php", json,  function( data ) {
                    var data1 = data.substring(2, data.length);
                    window.location.href = "";
                });
                        return false;// alert("alskdfj");
            //}
          
          
            
        }
        

        $("#submit1").click(function(){
            
            var result = $("#form1").serializeArray();
            var json = {};
            json["url"] = document.URL;
            json["action"] = "register";
            jQuery.each(result, function(){json[this.name] = this.value || '';});
            
                $.get("test.php", json,  function( data ) {
                    //alert(data);
                    //alert(data);
                    $("#registertomodal").hide();
                    $("#logintomodal").hide();
                    $("#topbarid").html("MedAssist: "+data);
                    $("#register").modal('hide');
                    $("#itemsonnav").append("<li id = 'logout' ><a href = '#' >Logout</a></li>");
                    $("#logout").on("click", loggoutt);
                    location.reload();
                });
                        return false;// alert("alskdfj");
            //}
          
          
            
        });

        $("#save_settings_button").click(function(){
            
            var result = $("#settings_form").serializeArray();
            var json = {};
            json["url"] = document.URL;
            json["action"] = "set_settings";
            jQuery.each(result, function(){json[this.name] = this.value || '';});
            
                $.get("test.php", json,  function( data ) {
                    
                    
                    location.reload();
                });
                        return false;// alert("alskdfj");
            //}
          
          
            
        });


        $("#login1").click(function(){

      
            
            var result = $("#loginform1").serializeArray();
            var json = {};
            json["url"] = document.URL;
            json["action"] = "login";
            jQuery.each(result, function(){json[this.name] = this.value || '';});
            
                $.get("test.php", json,  function( data ) {
                    
                    if(data === ""){
                        
                       $("#content1").append("<div class='alert alert-warning alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><strong>Warning! Invalid ID</strong> Are you sure you registered?</div>");
                        
                    }
                    else{
                    //alert(data);
                    $("#intro").hide();
                    $("#registertomodal").hide();
                    $("#logintomodal").hide();
                    $("#topbarid").html("MedAssist: "+data);
                    $("#login").modal('hide');
                    $("#itemsonnav").append("<li id = 'logout' ><a href = '#' >Logout</a></li>");
                    $("#logout").on("click", loggoutt);

                    location.reload();
                    }
                });
                        return false;// alert("alskdfj");
            //}
          
          
            
        });


        $("#updaterangebutton").click(function(){

      
            
            var result = $("#updaterange").serializeArray();
            var json = {};
            json["url"] = document.URL;
            json["action"] = "updaterange";

            jQuery.each(result, function(){json[this.name] = this.value || '';});
            
            

          var result = $.ajax({type: "GET", url: 'test.php',data: json,

                error: function(result, status, error) {
              var err = eval("(" + result.responseText + ")");
              alert(err.Message);
                },
            async: false}).responseText;
          //alert(result);
          if(result === "bad"){
            $("#invalidrange").modal('show');
            return false;
        }
          
          
          var object = JSON.parse(result);
          var glucose_values = object[0];

          var first_time = glucose_values[0];
          var last_time = glucose_values[glucose_values.length-1];
          //alert(first_time[0]+ " "+ last_time[0]);


          var date1 = new Date(first_time[0]);
          var date2 = new Date(last_time[0]);

          var timeresult = date1.toDateString() + " - " + date2.toDateString();
          

          $("#time_header").empty().append("<h3><center>"+timeresult+"</center></h3>");

          var rate_of_change_values = object[1];
          var events = object[2];
          var events = prepare2(events);

          //alert(rate_of_change_values);
            

           if(location.href === "<?php echo  WEBSITE1 ;?>"||location.href === "<?php echo  WEBSITE2 ;?>"){
            chart1(chart1,glucose_values, chart2, rate_of_change_values,events, chart3, chart4, chart5, chart6, 30*1000, low_n_high_values);
                

          //chart1(chart1,glucose_values, chart2, rate_of_change_values,events, chart3, chart4, chart5, chart6,1*60,low_n_high_values);
            }
          return false;
          
            
        });
        

       





       });
function prepare2(dataArray) {
        return dataArray.map(function (item, index) {
            return {color: 'green', width: 2, value: item[0]};
        });
    }

function chart1(chart1, data1, chart2, data2, events, chart3, chart4, chart5, chart6, monthorday,low_n_high_values){


    function process(data1, data2,xMin, xMax){

        var glucose = new Array();
        var x = 0;
        for(var i = 0; i < data1.length; ++i){

            if( xMin<= data1[i][0] && data1[i][0]<=xMax){
                
                glucose[x] = data1[i][1];
                ++x;
            }
        }
        glucose.sort(function(a,b){return a-b});

        

        var min = glucose[0];
        var max = glucose[glucose.length-1];


        var where = 0;
        var current = glucose[0];
        var bins = new Array();
        var cats = new Array();

        var temp = min;
        for(var i = 0; i < max-min+1; ++i){
            bins[i] = [temp,0];
            cats[i] = temp+'';
            temp++;
        }
        for(var i = 0; i < glucose.length; ++i){
            

            if(glucose[i] == current){
                ++bins[where][1];
            }
            else{
                current = glucose[i];
                while(current != bins[where][0]){
                    where++;
                    
                }
                bins[where][1]++;

            }
        }

         var binsize = parseInt(low_n_high_values[2]);


        //to be used when binsize is not 1
        var morethanonehistogram= new Array();
        var cats = new Array();
        var start_value = bins[0][0] + binsize;
        var cat_bool = true;
        var histograms_counter = 0;
        for(var i =0; i < bins.length; i++){
            if(bins[i][0] < start_value){
                //used only for initiation
                if(cat_bool == true){
                    cats.push("" + bins[i][0] +"-"+(start_value-1));
                    cat_bool = false;
                }
                if(morethanonehistogram[histograms_counter] !=null)
                    morethanonehistogram[histograms_counter] = morethanonehistogram[histograms_counter] + bins[i][1];
                else //used only for initiation
                    morethanonehistogram[histograms_counter] = bins[i][1];
            }
            else if( bins[i][0]==start_value){
                
                start_value = bins[i][0]+binsize;
                cats.push("" + bins[i][0] +"-"+(start_value-1));
                histograms_counter++;
                morethanonehistogram[histograms_counter] = bins[i][1];
            }
        }
        hist11(cats,morethanonehistogram);

        hist1(cats,bins);



        var roc = new Array();
        x = 0;
        for(var i = 0; i < data2.length; ++i){

            if( xMin<= data2[i][0] && data2[i][0]<=xMax){
                
                roc[x] = data2[i][1];
                ++x;
            }
        }
        roc.sort(function(a,b){return a-b});

        //alert(roc);


        var min = roc[0];
        var max = roc[roc.length-1];

        
        var where = 0;
        var current = roc[0];
        var bins = new Array();
        var cats = new Array();

        var temp = min;
        //alert( min + " "+ max);
        for(var i = 0; i < 10*(max-min+1); ++i){
            bins[i] = [temp,0];
            cats[i] = temp+'';
           temp =  Math.round((0.1 + temp) * 1e12) / 1e12;
        }
        //alert(bins);

        for(var i = 0; i < roc.length; ++i){
           
            //alert( roc[i] + ' ' + current);
            if(roc[i] == current){
                ++bins[where][1];
            }
            else{

                current = roc[i];
                while(current != bins[where][0]){
                    where++;

                }
                
                ++bins[where][1];

            }
        }

        hist2(cats, bins);

    }
    function hist2(cats, bins){
        chart6 = new Highcharts.Chart({
            chart: {
                renderTo: 'container6',
                type: 'column',
                margin: [ 50, 50, 100, 80],
                zoomType: 'x'
            },
            title: {
                text: 'Distribution of Rate of Change'
            },
            xAxis: {
                
                labels: {
                    rotation: -45,
                    align: 'right',
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Samples'
                }
            },
            legend: {
                enabled: false
            },
            
            series: [{
                name: 'Rate of Change Value',
                data: bins
            }]
        });
    }
    function hist1(cats, bins){
        chart5 = new Highcharts.Chart({
            chart: {
                renderTo: 'container5',
                type: 'column',
                margin: [ 50, 50, 100, 80],
                zoomType: 'x'
            },
            title: {
                text: 'Distribution of Glucose Values'
            },
            xAxis: {
                plotBands: [{ // mark the weekend
                    color: '#FCFFC5',
                    from: low_n_high_values[0],
                    to: low_n_high_values[1]
                }],
                min: 0,
                labels: {
                    rotation: -45,
                    align: 'right',
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Samples'
                }
            },
            legend: {
                enabled: false
            },
            
            series: [{
                name: 'Glucose Value',
                data: bins
            }]
        });
    }
    function hist11(cats, bins){
        var loww = parseInt(low_n_high_values[0]);
        var highh = parseInt(low_n_high_values[1]);

        var start = 0;
        var end = 0;

        var onetimeend = true;
        var onetimestart = true;
        for(var i = 0; i < cats.length; i++){

            var temp = cats[i];
            var middle = temp.indexOf("-");
            var firstint = parseInt(temp.substring(0,middle));
            var secint = parseInt(temp.substring(middle+1, temp.length));

            if(loww < firstint && onetimestart == true){
                start = i-1;
                onetimestart= false;
            }
            if(highh< secint && onetimeend ==true){
                end = i;
                onetimeend = false;
            }
                
        }
        chart5 = new Highcharts.Chart({
            chart: {
                renderTo: 'container5',
                type: 'column',
                margin: [ 50, 50, 100, 80],
                zoomType: 'x'
            },
            title: {
                text: 'Distribution of Glucose Values'
            },
            xAxis: {
                 categories: cats,
                plotBands: [{ // mark the weekend
                    color: '#FCFFC5',
                    from: start,
                    to: end
                }],
                min: 0,
                labels: {
                    rotation: -45,
                    align: 'right',
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Samples'
                }
            },
            legend: {
                enabled: false
            },
            
            series: [{
                name: 'Glucose Value',
                data: bins
            }]
        });
    }

    function arm( events, xMin, xMax, chart, data1){

        var current_index = 0;
        var data1 = prepare(data1);

        var values = new Array();
        for(var x = 0; x< 40; ++x){
            values[x] = 0;
        }

        var denom = 0;

        for(var i = 0; i < events.length; ++i){

            if( xMin <= events[i].value && events[i].value <=xMax && events[i].color == "green"){
                denom++;
                for(var j = current_index; j < data1.length; ++j){

                    if( events[i].value <= data1[j].x   ){
                        var index = 0;
                        for( var x = j; x < j+40; ++x){

                            if( x < data1.length)
                            values[index] = values[index] + data1[x].y;
                            index++;

                        }
                        current_index = j;
                        break;

                    }

                }



                //alert(values);


            }

        }

        for(var i = 0; i < values.length; i++){
            values[i] = values[i]/denom;
        }

        var base = values[0];
        for(var i = 0; i < values.length; i++){
            values[i] = values[i]-base;
        }
        

        var time = 0;
        var result = new Array();
        for(var i = 0; i < values.length; i++){
            result[i]= [time,values[i]];
            time+= 5;
        }
        

        call(result);
        call2(result);
    }
    
    function prepare(dataArray) {
        return dataArray.map(function (item, index) {
            return {x: item[0], y: item[1], myIndex: index};
        });
    }
    function average(dataArray,xMin, xMax, low, high){

        var total = 0;
        var number_of_values = 0;
        var first_valid_number_flag = true;
        var first_valid_number = 0;
        var last_valid_number = 0;

        var amount_low = 0;
        var amount_inrange = 0;
        var amount_high = 0;
        //Mean calculation using points between xMin and xMax
        for(var i = 0; i < dataArray.length; i++){
            if( xMin<= dataArray[i].x && dataArray[i].x<=xMax){

                if(dataArray[i].y <low)
                    amount_low++;
                else if(low<=dataArray[i].y && dataArray[i].y <=high){
                    amount_inrange++;
                }
                else if(high<dataArray[i].y)
                    amount_high++;

                if(first_valid_number_flag){
                    first_valid_number = i;
                    first_valid_number_flag=false;
                }

                
                total += dataArray[i].y;  
                number_of_values++; 

                last_valid_number = i;
            }
        }

        var percentage_low = amount_low/number_of_values;
        var percentage_inrange= amount_inrange/number_of_values;
        var percentage_high = amount_high/number_of_values;

        
        total /= number_of_values;
        var average = total;


        // Variance calculations based off "average" variable for mean
        var total_var = 0;
        var bot = 0;
        for(var i = first_valid_number; i <= last_valid_number; i++){
            var x = dataArray[i].y -average;
            x = x*x;
            total_var+=x;
            bot++;
        }

        var vari = total_var / bot;

        var square_root = Math.sqrt(vari);

       
        $("#percentagelow").empty().append(percentage_low.toFixed(3));
        $("#percentagehigh").empty().append(percentage_high.toFixed(3));
        $("#percentagein").empty().append(percentage_inrange.toFixed(3));
        $("#average").empty().append(average.toFixed(3));
        $("#variance").empty().append(vari.toFixed(3));
        $("#stdev").empty().append(square_root.toFixed(3));

        $("#low_limit").empty().append("Percentage Low (<"+low_n_high_values[0]+")");
        $("#high_limit").empty().append("Percentage High (>"+low_n_high_values[1]+")");
        $("#in_range").empty().append("Percentage In Range ("+low_n_high_values[0] + " - " + low_n_high_values[1]+")");

    }

    function unzoom() {
             chart1.options.chart.isZoomed = false;
             chart2.options.chart.isZoomed = false;
             
            
            chart1.xAxis[0].setExtremes(null, null);
            chart2.xAxis[0].setExtremes(null, null);
            

    }

    function syncronizeCrossHairs(chart, val) {
            var container = $(chart.container),
                offset = container.offset(),
                x, y, isInside, report;

            container.mousemove(function(evt) {

                xx = evt.clientX - chart.plotLeft - offset.left;
                yy = evt.clientY - chart.plotTop - offset.top;
                var xAxis = chart.xAxis[0];
                //remove old plot line and draw new plot line (crosshair) for this chart
                var xAxis1 = chart1.xAxis[0];
                xAxis1.removePlotLine("myPlotLineId");
                xAxis1.addPlotLine({
                    value: chart.xAxis[0].translate(xx, true),
                    width: 1,
                    color: 'red',
                    //dashStyle: 'dash',                   
                    id: "myPlotLineId"
                });
                //remove old crosshair and draw new crosshair on chart2
                var xAxis2 = chart2.xAxis[0];
                xAxis2.removePlotLine("myPlotLineId");
                xAxis2.addPlotLine({
                    value: chart.xAxis[0].translate(xx, true),
                    width: 1,
                    color: 'red',
                    //dashStyle: 'dash',                   
                    id: "myPlotLineId"
                });

                
                //if you have other charts that need to be syncronized - update their crosshair (plot line) in the same way in this function.                   
            });
    }
    function showtheothers(point,val){
        if(val === 1)
                    chart1.tooltip.refresh( chart1.series[0].data[point] );
                
        if(val=== 2)
                    chart2.tooltip.refresh( chart2.series[0].data[point] );
    }

    function computeTickInterval(xMin, xMax) {
        var zoomRange = xMax - xMin;
        
        if (zoomRange <= 2)
            currentTickInterval = 0.5;
        if (zoomRange < 20)
            currentTickInterval = 1;
        else if (zoomRange < 100)
            currentTickInterval = 5;
    }

    function setTickInterval(event) {
        var xMin = event.xAxis[0].min;
        var xMax = event.xAxis[0].max;
        computeTickInterval(xMin, xMax);

        chart1.xAxis[0].options.tickInterval = currentTickInterval;
        chart1.xAxis[0].isDirty = true;
        chart2.xAxis[0].options.tickInterval = currentTickInterval;
        chart2.xAxis[0].isDirty = true;
        
    }
    $(window).resize(function() {
        
        var width = $(window).width() / 2;
        chart1.setSize(width, 400, doAnimation = false);
        chart2.setSize(width, 400, doAnimation = false);
        chart3.setSize(width, 400, doAnimation = false);
        chart4.setSize(width, 400, doAnimation = false);
        chart5.setSize(width, 400, doAnimation = false);
        chart6.setSize(width, 400, doAnimation = false);
    });
    //reset the extremes and the tickInterval to default values
    function unzoom() {
        chart1.xAxis[0].options.tickInterval = defaultTickInterval;
        chart1.xAxis[0].isDirty = true;
        chart2.xAxis[0].options.tickInterval = defaultTickInterval;
        chart2.xAxis[0].isDirty = true;
        
    
        chart1.xAxis[0].setExtremes(null, null);
        chart2.xAxis[0].setExtremes(null, null);
        
    }
    var prepared1 = prepare(data1);


        chart1 = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                zoomType: 'x'
                
            },
            title: {
                text: 'All Data'   
            },

           
            xAxis: {

            min: prepared1[0][0],
            max: prepared1[prepared1.length-1][0],
            type: 'datetime', //ensures that xAxis is treated as datetime values
            tickInterval:24 * 3600*1000,
            startOnTick: false,
            endOnTick: false,
            showLastLabel: true,

            plotLines: events,
            events:{
               
                            afterSetExtremes:function(){
                                
                                 if (!this.chart.options.chart.isZoomed)
                                 {                                         
                                    var xMin = this.chart.xAxis[0].min;
                                    var xMax = this.chart.xAxis[0].max;

                                    var date1 = new Date(xMin);
                                      var date2 = new Date(xMax);

                                      var timeresult = date1.toDateString() + " - " + date2.toDateString();
                                      

                                      $("#time_header").empty().append("<h3><center>"+timeresult+"</center></h3>");
                                     
                                    var zmRange = computeTickInterval(xMin, xMax);
                                    chart1.xAxis[0].options.tickInterval =zmRange;
                                    chart1.xAxis[0].isDirty = true;
                                    chart2.xAxis[0].options.tickInterval = zmRange;
                                    chart2.xAxis[0].isDirty = true;
                                    
                                     
                                   chart2.options.chart.isZoomed = true;
                                  
                                   chart2.xAxis[0].setExtremes(xMin, xMax, true);
                                
                                    arm( events, xMin, xMax, null, data1);

                                    average(prepared1, xMin, xMax,low_n_high_values[0],low_n_high_values[1]);
                                    
                                    process(data1, data2,xMin, xMax);
                                      chart2.options.chart.isZoomed = false;
                                   
                                }
                            }
                            
                            
                        }
            },
            
            yAxis: {
                plotBands: [{ // mark the weekend
                    color: '#FCFFC5',
                    from: low_n_high_values[0],
                    to: low_n_high_values[1]
                }],
                min: 0,
                title: { text: 'Glucose (mg/dl)'} //ensures that xAxis is treated as datetime values
            },

            series: [{
                point:{ events: { mouseOver: function(){ showtheothers(this.myIndex, 2);     }}},
                name: 'Glucose Values',
                turboThreshold: 10000,
                data: prepare(data1)
            }]
        }, function(chart) { //add this function to the chart definition to get synchronized crosshairs
                    syncronizeCrossHairs(chart,1);
                });
    
    chart2 = new Highcharts.Chart({
            chart: {
                renderTo: 'container2',
                zoomType: 'x'
                
            },
            title: {
                text: 'Rate of Change'   
            },
            
           
            xAxis: {

                type: 'datetime', //ensures that xAxis is treated as datetime values
            tickInterval:24 * 3600 * 1000,
                        startOnTick: false,
                        endOnTick: false,
                        showLastLabel: true,
                        plotLines: events,
                        events: {
                            afterSetExtremes: function() {
                                if (!this.chart.options.chart.isZoomed) 
                                {
                                    var xMin = this.chart.xAxis[0].min;
                                    var xMax = this.chart.xAxis[0].max;

                                    var date1 = new Date(xMin);
                                      var date2 = new Date(xMax);

                                      var timeresult = date1.toDateString() + " - " + date2.toDateString();

                                      $("#time_header").empty().append("<h3><center>"+timeresult+"</center></h3>");

                                    average(prepared1, xMin, xMax,low_n_high_values[0],low_n_high_values[1]);


                                    var zmRange = computeTickInterval(xMin, xMax);
                                    chart1.xAxis[0].options.tickInterval =zmRange;
                                    chart1.xAxis[0].isDirty = true;
                                    chart2.xAxis[0].options.tickInterval = zmRange;
                                    chart2.xAxis[0].isDirty = true;
                                    
                                    
                                    
                                   chart1.options.chart.isZoomed = true;
                                   
                                    chart1.xAxis[0].setExtremes(xMin, xMax, true);
                                
                                    arm( events, xMin, xMax, null, data1);
                                    
                                    process(data1, data2,xMin, xMax);
                                     chart1.options.chart.isZoomed = false;
                                   
                                
                                }
                            }
                        }
            },

            yAxis: {
                min: -5,
                title: { text: 'Rate of Change Glucose Per Min (mg/dl*min)'}, //ensures that xAxis is treated as datetime values
                plotLines : [{
                    value : 0,
                    color : 'red',
                    width : 2
                }]

            },
            

            series: [{
                point:{ events: { mouseOver: function(){ showtheothers(this.myIndex, 1);     }}},
                name: 'ROC',
                turboThreshold: 10000,
                data: prepare(data2)
            }]
        },function(chart) { //add this function to the chart definition to get synchronized crosshairs
                    //this function needs to be added to each syncronized chart 
                    syncronizeCrossHairs(chart, 2);
                    
                });

var xMin1 = chart1.xAxis[0].min;
var xMax1 = chart1.xAxis[0].max;

average(prepared1, xMin1, xMax1,low_n_high_values[0],low_n_high_values[1]);

arm( events, xMin1, xMax1, null, data1);
                                    
process(data1, data2,xMin1, xMax1);

function call( data3){
    chart3 = new Highcharts.Chart({
                chart: {
                    renderTo: 'container3',
                    zoomType: 'x'
                    
                },
                title: {
                    text: 'Average Response To Meal'   
                },

               
                xAxis: {
                    title: { text: 'min'},
                min: 0,
                tickInterval: 20,
                    
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true,

                
                },
                
                yAxis: {
                    title: { text: 'Glucose (mg/dl)'},
                    plotLines : [{
                    value : 0,
                    color : 'red',
                    width : 2
                }] //ensures that xAxis is treated as datetime values
                },

                series: [{
                    name: 'Glucose Values',
                    turboThreshold: 10000,
                    data: data3
                }]
            });
}

function call2( data3){

    var roc_array = new Array();
    for(var i = 0; i < data3.length; ++i){
        if( i == 0){
            var value = (data3[i+1][1] - data3[i][1])/5;
            roc_array[0]=value;
        }
        else if( i  == data3.length-1){
            var value = (data3[i][1] - data3[i-1][1])/5;
            roc_array[i]=value;
        }
        else{
            var value = (data3[i+1][1] - data3[i-1][1])/10;
            roc_array[i]=value;
        }
    }

    var formatted_array = new Array();
    for(var i = 0; i < roc_array.length; ++i){

        formatted_array[i]= [data3[i][0], roc_array[i]];

    }


    chart4 = new Highcharts.Chart({
                chart: {
                    renderTo: 'container4',
                    zoomType: 'x'
                    
                },
                title: {
                    text: 'Average Rate Of Change Response To Meal'   
                },

               
                xAxis: {
                    title: { text: 'mg/dl per min'},
                    min: 0,
                    tickInterval: 20,
                    
                    startOnTick: true,
                    endOnTick: true,
                    showLastLabel: true,
                },
                
                yAxis: {
                    title: { text: 'mg/dl per min'},
                    plotLines : [{
                    value : 0,
                    color : 'red',
                    width : 2
                    }] //ensures that xAxis is treated as datetime values
                },

                series: [{
                    name: 'Glucose Values',
                    turboThreshold: 10000,
                    data: formatted_array
                }]
            });

    
 
}

        
        
}





</script>