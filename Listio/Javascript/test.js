var menuOut = true;
var listLocation = document.getElementById("listContentUl");
var listObject1241 = {title: "myTitle", tasks: ["create", "this", "software", "now"], completed: ["this", "task", "is", "completed"]};
var newTaskInput = document.getElementById("listInput");
var /*listID,*/ newList, currentList;
var listID = "KVtzEYM9eJaeoiSHtuhL";

// The reference point in the database. Note that when creating user specific databases it will be required to do this in the firebase.onAuthStateChanged
dbRef = firestore.collection("users").doc("test").collection("lists");

//window.onload = retrieveLists();

// Get all the lists from the database
function retrieveLists() {
	// Get the data from the database
	dbRef.get().then(function(querySnapshot) {
		// Extract the data for each document and put it into global varables
		querySnapshot.forEach(function(doc) {
			// Check if the doc exists
			if(doc.exists) {
				var currentData = doc.data();
				console.log(currentData.tasks);
				console.log(currentData);
			} else {	// Else log that the doc does not exist
				console.log("The document does not exist");
			}
		})
	}).catch(function(error) { // Log and error with getting a document
			console.log("Error getting document: " + error);
	})
}









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
	newList = dbRef.doc("KVtzEYM9eJaeoiSHtuhL");
	//newList.set(listObject1241);

	newList.get().then(function(doc) {
		console.log("Document data:", doc.data());
		var currentData = doc.data();
		console.log(currentData.tasks);
		console.log(currentData.title);
		//console.log
		listID = doc.id;
		window[listID] = {title: currentData.title, tasks: currentData.tasks};
		test();
	})
	// Set a global variable name dynamically as shown below
	var myvar = "varName";
	window[myvar] = "hello";
	test();
}

function loadList(/*listID*/) {
	// Empty the what is currently displayed in the listContentUl
	listLocation.innerHTML = "";

	// Get the current lists task and title from the firestore doc
	dbRef.doc(listID).get().then(function(doc) {
		// Save the current data in the currentData var
		var currentData = doc.data();

		// Set the currentList to store the current lists data
		currentList = doc.data();
		console.log(currentData.tasks);
		// Append all the tasks to the listLocation
		currentData.tasks.forEach(function(element) {
			// Create the li element
			var crLiElement = document.createElement("ul");
			crLiElement.setAttribute("class", "listContentLi");
			// crLiElement.setAttribute("id",)

			// Create the <p> element
			var crPElement = document.createElement("p");
			crPElement.setAttribute("class", "actualListText");
			crPElement.setAttribute("contenteditable", "true");
			crPElement.innerHTML = element;

			// Append the above elements
			listLocation.appendChild(crLiElement);
			crLiElement.appendChild(crPElement);
		})
	})
}

// Check if enter is pressed in the textarea for new tasks
function newTaskListener(event) {
	// Get the keyCode
	var code = event.keyCode;

	// Check if enter is pressed
	if(code == 13) {
		addTask();
	}
}

// Add a new task to the current list
function addTask () {
	// Get the value of the input
	var newTask = newTaskInput.value;

	// Empty the input of the input textarea
	newTaskInput.value = "";

	// Create the li element
	var crLiElement = document.createElement("ul");
	crLiElement.setAttribute("class", "listContentLi");
	// crLiElement.setAttribute("id",)

	// Create the <p> element
	var crPElement = document.createElement("p");
	crPElement.setAttribute("class", "actualListText");
	crPElement.setAttribute("contenteditable", "true");
	crPElement.innerHTML = newTask;

	// Append the above elements
	listLocation.appendChild(crLiElement);
	crLiElement.appendChild(crPElement);

	// Push the new task to the current list objects array of tasks
	currentList.tasks.push(newTask);

	// Update the firestore doc with the new task by sending in the currentList object
	dbRef.doc(listID).set(currentList);
}


function test() {
	console.log(varName);
	console.log(window[listID]);
}