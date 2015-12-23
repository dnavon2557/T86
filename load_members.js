$( document ).ready( function () {
	$.get("members", function (data, status) {
		$('#member-bubbles').html(data);
	});
});