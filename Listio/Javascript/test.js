var menuOut = true;

function hideMenu() {
	var menu = document.getElementById("menubar");
	var box1 = document.getElementById("box1");
	var box2 = document.getElementById("box2");
	if(menuOut==true) {
	menu.classList.add("hideMenu");
	box1.classList.add("boxColor");
	box2.classList.add("boxColor", "rotateBox");

	menuOut=false;
	} else {
	menu.classList.remove("hideMenu");
	box1.classList.remove("boxColor");
	box2.classList.remove("boxColor", "rotateBox");

	menuOut=true;
	}
}