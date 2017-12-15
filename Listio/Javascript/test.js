var menuOut = true;

// The function that hides or shows the menu
function hideMenu() {
	// Get the menu element
	var menu = document.getElementById("menubar");

	// Check if the menu is hidden or not
	if(menuOut==true) {
		// Add the class that hides the menu
		menu.classList.add("hideMenu");

		menuOut=false;
	} else {
		// Remove the class that hides the menu
		menu.classList.remove("hideMenu");

		menuOut=true;
	}
}