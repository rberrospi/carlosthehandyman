$(function() {
// OPACITY OF BUTTON SET TO 0%
$(".roll").css("opacity","0");
 
// ON MOUSE OVER
$("a.hover-image").hover(function(){
  $(this).find(".roll").animate({
     opacity: 1
  },"fast");
 
// This only fires if the row is not undergoing an animation when you mouseover it
},
 
// ON MOUSE OUT
function () {
 
// SET OPACITY BACK TO 50%
  $(this).find(".roll").stop().animate({
		opacity: 0
	}, "fast");
	
});

});






