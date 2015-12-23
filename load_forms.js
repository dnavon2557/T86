$(document).ready( function () {
	var password = prompt("Enter the password");
	$.post('getForms', {pass:password}, function (data) {
		console.log(data);
		$('#forms').html(data);
	});
});