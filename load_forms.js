$(document).ready( function () {
	var password = prompt("Enter the password");
	$.post('getForms', {pass:password}, function (data) {
		$('#forms').html(data);
   	});
});
$('#addMission').ready( function () {
	$.get('getMission', function (data) {
		$('#mission_statement').val(data);
	})
});
