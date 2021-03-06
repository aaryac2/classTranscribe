/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
$(function(){
	$("#upload-link").on('click', function(event){
		event.preventDefault();
		$("#upload-file:hidden").trigger('click');
        $("#upload-file").data('clicked', true);
	})
});

/* after the file has been uploaded, display it so the user knows which file was chosen*/
function getFilename(file_upload) {
    var file = file_upload.files[0];  
    var filename = file.name;
    $("#filename i").html(filename);
}

/* parse the text box of instructors */
$(function() {
    $("#instructor-button").on('click', function(event) {
        var instructors = $("#instructor-box").val();
        $("#i-test").html(instructors);
    })
});

/* parse the text box of students or the uploaded file */
$(function() {
    $("#student-button").on('click', function(event) {
        var students = $("#student-box").val();
        $("#s-test").html(students);
        if($("#upload-file").data('clicked')) {

        }
        else {

        }
    })
});

/* filters searches */
function filter() {
    $.ajax({
        type: "GET",
        url: "/manageCourse/get_user_courses",
        success: function(data) {
            console.log(data);
        }
    });
}
