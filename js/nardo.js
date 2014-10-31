$(document).ready(function(){
	$("ul.nav a").click(function() {
	   	var href = $(this).attr('id').substring(1);;
		href = $("section[id='"+href+"']");
		$('html,body').animate({scrollTop: href.offset().top - window.innerHeight + href.height() },'slow');
	});

	$("#contact_submit").click(function(){  

		var checkform = check_contact_form();
		if(checkform !== "ok"){
			$("#whaterror").empty().append("You accidentally left the '"+ checkform +"' field empty :/."); 
			$('#error').modal('show') ;
		}

		var result = $("#contact").serializeArray();
	    var json = {};
	    
	    jQuery.each(result, function(){json[this.name] = this.value || '';});
	    

	    var result;

	    $.ajax({
	        url: "php/contact.php",
	        type: 'get',
	        data: json,
	        async: false,
	        success: function(data) {
	            result = data;
	        } 
	     });
    
    

		$('#suc').modal('show') ; 

		return false;

	});

	function check_contact_form() {
		var name = $("#name").val();
		var email = $("#email").val();
		var subject = $("#subject").val();
		var message = $("#message").val();

		if(name === ""){
			return "name";
		}
		else if(email === ""){
			return "email";
		}
		else if(subject === ""){
			return "subject";
		}
		else if(message === ""){
			return "message";
		}

		return "ok";


	}
});