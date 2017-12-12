$(document).ready(function() {
  $("li").click(function() {
    let val = $(this).text();
    if(val == decodeURIComponent($("#answer").val())) {
      $("#modal-text").text("Congrats that is the correct answer!");
      $("#modal-header").text("Congrats!");
      $("#modal").show();
    }
    else {
      $("#modal-text").text("I'm sorry the answer was: " + decodeURIComponent($("#answer").val()));
      $("#modal-header").text("Uh-oh...");
      $("#modal").show();
    }
  });

  $("input").click(function() {
    $("#submit").hide();
    $("#reminders").show();
    alert("Reminder Created!");
  });
});