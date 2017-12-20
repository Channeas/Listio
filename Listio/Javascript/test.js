var menuOut = true;
var listLocation = document.getElementById("listContentUl");
var listObject1241 = {title: "myTitle", tasks: ["create", "this", "software", "now"], completed: ["this", "task", "is", "completed"]};
var newTaskInput = document.getElementById("listInput");
var /*listID,*/ newList, currentList;
var listID = "KVtzEYM9eJaeoiSHtuhL";
var listObjectExample = {
	title: "none",
	tasks: [],
	completed: []
}

// The reference point in the database. Note that when creating user specific databases it will be required to do this in the firebase.onAuthStateChanged
dbRef = firestore.collection("users").doc("test").collection("lists");

window.onload = retrieveLists();

// Get all the lists from the database
function retrieveLists() {
	// Get the data from the database
	dbRef.get().then(function(querySnapshot) {
		// Extract the data for each document and put it into global varables
		querySnapshot.forEach(function(doc) {
			// Check if the doc exists
			if(doc.exists) {
				var currentData = doc.data();
				var currentDocID = doc.id;
				console.log(currentDocID);
				/*console.log(currentData.tasks);
				console.log(currentData);*/
				// Save each docs data in a global variable object
				window[currentDocID] = currentData;

				listOfLists(currentData.title, currentDocID);
			} else {	// Else log that the doc does not exist
				console.log("The document does not exist");
			};
		});
	}).catch(function(error) { // Log and error with getting a document
			console.log("Error getting document: " + error);
	});
};

function listOfLists(title, ID) {
	var listOfListsLocation = document.getElementById("listOfLists");

	var crLiElement = document.createElement("li");
	crLiElement.setAttribute("class", "listOfListsLi");
	crLiElement.setAttribute("onclick", "loadList(" + ID + ")");
	crLiElement.innerHTML = title;

	listOfListsLocation.appendChild(crLiElement);
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

	// Create a new firestore document
	newList = dbRef.doc();
	newList.set(listObjectExample);

	newList.get().then(function(doc) {
		// Set teh currentData object to be be and empty list object
		var currentData = doc.data();

		// Set the list id
		listID = doc.id;

		// Set the global variable with the name of the id of the list object
		window[listID] = {title: currentData.title, tasks: currentData.tasks};
		currentList = listObjectExample;
	});
	// Set a global variable name dynamically as shown below
	var myvar = "varName";
	window[myvar] = "hello";
}

function loadList(loadListID) {
	// Empty the what is currently displayed in the listContentUl
	listLocation.innerHTML = "";

	console.log(loadListID);
	// Get the current lists task and title from the firestore doc
	//dbRef.doc(listID).get().then(function(doc) 
	if("1"=="1"){
		// Save the current data in the currentData var
		var currentData = window[loadListID];

		// Set the currentList to store the current lists data
		currentList = loadListID;
		console.log(loadListID.tasks);

		// Set the title
		var titleLocation = document.getElementById("title");
		titleLocation.value = loadListID.title;

		// Append all the tasks to the listLocation
		loadListID.tasks.forEach(function(element) {
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
	}
}

// Check if enter is pressed in the textarea for new tasks
function newTaskListener(event) {
	// Get the keyCode
	var code = event.keyCode;

	// Check if enter was pressed
	if(code == 13) {
		addTask();
	}
}

// Add a new task to the current list
function addTask() {
	// Get the value of the input
	var newTask = newTaskInput.value;

	// Empty the input of the input textarea
	newTaskInput.value = "";

	console.log(newTask.length);

	if(newTask.length >= 2) {
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

	// Update the local list object
	window[listID] = currentList;

	// Update the firestore doc with the new task by sending in the currentList object
	dbRef.doc(listID).set(currentList);
	} else {
		console.log("Can not add an empty task");
	}
}

// Check if enter is pressed in the title input field
function changeTitleListener(event) {
	// Get the keycode
	var code = event.keyCode;

	// Check if enter was pressed
	if(code == 13) {
		changeTitle();
		console.log("Changing title");
	}
}

// Change the title of the current list being displayed
function changeTitle() {
	// Get the value of the input field
	var newTitle = document.getElementById("title").value;
	// Save the value of the title to the currentList object
	currentList.title = newTitle;

	// Update the local list object
	window[listID] = currentList;

	// Update the firestore doc with the new title by sending in the currentList object
	dbRef.doc(listID).set(currentList);
}
