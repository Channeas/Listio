var menuOut = true;
var listLocation = document.getElementById("listContentUl");
var listObject1241 = {title: "myTitle", tasks: ["create", "this", "software", "now"]};
var listID;

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

// The function that marks a task as done
function taskDone(id) {
	console.log(id);
}

function createList() {
	// Empty the what is currently displayed in the listContentUl
	listLocation.innerHTML = "";

	console.log(listObject1241);

	// Create a new firestore document
	newList = firestore.collection("users").doc("test").collection("lists").doc();
	newList.set(listObject1241);

	newList.get().then(function(doc) {
		var currentData = doc.data;
		console.log(currentData.tasks);
		console.log(doc.data);
		listID = doc.id;
		window[listID] = {title: currentData.id, tasks: currentData.tasks};
		// Problem with getting the data from the firebase firestore
		console.log(window[listID]);
	})
	// Set a global variable name dynamically as shown below
	var myvar = "varName";
	window[myvar] = "hello";
	test();
}

function test() {
	console.log(varName);
	console.log(window[listID]);
}