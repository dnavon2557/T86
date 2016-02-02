$( document ).ready( function () {
	$.get("members", function (data, status) {
		$('#member-bubbles').html(data);
	});
	$.get("/getMission", function (data, status) {
		$('#mission_statement').html(data);
	});
});