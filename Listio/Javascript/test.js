var menuOut = true;
var listLocation = document.getElementById("listTasks");
var newTaskInput = document.getElementById("listInput");
var titleInput = document.getElementById("title");
var tellMeButton = document.getElementById("tellMeButton");
var newList, currentList;
var currentListIndex = 0;
var listID = "KVtzEYM9eJaeoiSHtuhL";
var listObjectExample = {
	title: "",
	tasks: [],
	completed: [],
	id: ""
}

// The reference point in the database. Note that when creating user specific databases it will be required to do this in the firebase.onAuthStateChanged
dbRef = firestore.collection("users").doc("test").collection("lists");

// The call to get all the list from the firebase database
window.onload = retrieveLists();

// Get all the lists from the database
function retrieveLists() {
	// Get the data from the database
	dbRef.get().then(function(querySnapshot) {
		// Extract the data for each document and put it into global varables
		querySnapshot.forEach(function(doc) {
			// Check if the doc exists
			if(doc.exists) {
				// Save the data in the var currentData
				var currentData = doc.data();
				
				// Saves the id of the current doc
				var currentDocID = doc.id;
				//currentData.id = currentDocID;

				// Save each docs data in a global variable object
				window[currentDocID] = currentData;

				// Call the function that adds each list to the list of lists
				listOfLists(currentData.title, currentDocID);

			} else {	// Else log that the doc does not exist
				console.log("The document does not exist");
			};
		});
	}).catch(function(error) { // Log and error with getting a document
			console.log("Error getting document: " + error);
	});
};

// The function for displaying lists in the menu 
function listOfLists(title, ID) {
	var listOfListsLocation = document.getElementById("listOfLists");

	var crLiElement = document.createElement("li");
	crLiElement.setAttribute("class", "listOfListsLi");
	crLiElement.setAttribute("id", ID + "_list");
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

		// Set menuOut to false
		menuOut=false;
	} else {
		// Remove the class that hides the menu
		menu.classList.remove("hideMenu");

		// Set menuOut to true
		menuOut=true;
	}
}

// The function for creating new lists
function createList() {
	// Empty the what is currently displayed in the list and empty the title
	listLocation.innerHTML = "";
	titleInput.value = "";

	// Fix what is hidden on the page
	unHide()

	// Create a new firestore document
	newList = dbRef.doc();
	newList.set(listObjectExample);

	// Create the firebase document and get the list id
	newList.get().then(function(doc) {
		// Set the currentData object to be be and empty list object
		var currentData = doc.data();

		// Save the empty arrays and title value as well as the new id in the currentList var
		currentList = currentData;
		currentList.id = doc.id;

		// Add the new list to the listOfLists
		listOfLists("none", doc.id);

		// Set the list id
		listID = doc.id;

		// Set the global variable with the name of the id of the list object
		window[listID] = {title: currentData.title, tasks: currentData.tasks};
	});
	// Set a global variable name dynamically as shown below
	var myvar = "varName";
	window[myvar] = "hello";
}

function loadList(loadListID) {
	// Set the currentListIndex to 0. Important if this is not the first list to be loaded
	currentListIndex = 0;
	
	// Empty the what is currently displayed in the list
	listLocation.innerHTML = "";

	console.log(loadListID);
	// Get the current lists task and title from the firestore doc
	//dbRef.doc(listID).get().then(function(doc) 
	if("1"=="1"){
		// Save the current data in the currentData var
		var currentData = window[loadListID];

		// Set the currentList to store the current lists data
		currentList = loadListID;

		// Set the listID to be the id of the loaded list
		listID = loadListID;

		// Fix what is hidden on the page
		unHide()

		// Log the loaded list id
		console.log(loadListID);

		// Set the title
		var titleLocation = document.getElementById("title");
		titleLocation.value = loadListID.title;

		// Append all the tasks to the listLocation
		loadListID.tasks.forEach(function(element) {
			// Call the function that adds the tasks
			addTask(element);
		})
	}
}

// The function that adds tasks
function addTask (element) {
	// Create the li element
	var crLiElement = document.createElement("ul");
	crLiElement.setAttribute("class", "listContentLi");
	crLiElement.setAttribute("id", "liItemNumber_" + currentListIndex);
	// crLiElement.setAttribute("id",)

	// Create the <p> element
	var crPElement = document.createElement("p");
	crPElement.setAttribute("class", "actualListText");
	crPElement.setAttribute("contenteditable", "true");
	//crPElement.setAttribute("")
	crPElement.innerHTML = element;


	// Add the delete icon div
	var deleteIconDiv = document.createElement("div");
	deleteIconDiv.setAttribute("class", "deleteIconDiv");
	deleteIconDiv.setAttribute("id", currentListIndex);
	deleteIconDiv.setAttribute("onclick", "deleteTask(this.id)");

	// Add the delete icon
	var deleteIcon = document.createElement("span");
	deleteIcon.setAttribute("class", "oi");
	deleteIcon.setAttribute("data-glyph", "trash");
	
	// Append the above elements
	listLocation.appendChild(crLiElement);
	crLiElement.appendChild(deleteIconDiv);
	deleteIconDiv.appendChild(deleteIcon);
	crLiElement.appendChild(crPElement);

	// Add 1 to the currentListIndex, which is for ordering the different list elements
	currentListIndex += 1;
}



// Check if enter is pressed in the textarea for new tasks
function newTaskListener(event) {
	// Get the keyCode
	var code = event.keyCode;

	// Check if enter was pressed
	if(code == 13) {
		// Prevent the line break from getting added
		event.preventDefault();
		
		// Call the function to create a new task
		createTask();
	}
}

// Add a new task to the current list
function createTask() {
	// Get the value of the input
	var newTask = newTaskInput.innerHTML;

	// Check so that the new task input is not empty
	if(newTask.length > 0) {
		console.log(newTask.length);
	// Call the function that adds a new task
	addTask(newTask);

	// Empty the input of the input textarea
	newTaskInput.innerHTML = "";

	// Push the new task to the current list objects array of tasks
	currentList.tasks.push(newTask);

	// Update the local list object
	window[listID] = currentList;

	// Update the firestore doc with the new task by sending in the currentList object
	dbRef.doc(currentList.id).set(currentList);
	
	} else { // Else log that the user can not create an empty task
		console.log("Can not add an empty task");
	}
}

// Check if enter is pressed in the title input field
function changeTitleListener(event) {
	// Get the keycode
	var code = event.keyCode;

	// Check if enter was pressed
	if(code == 13) {
		// Call the function for changing the title
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
	dbRef.doc(currentList.id).set(currentList);

	// Update the list of lists to display the right title
	document.getElementById(currentList.id + "_list").innerHTML = newTitle;
}

// Removes the hidden attribute from the title and new task input as well as hides the no list selected message
function unHide() {
	// Remove the hidden tag attribute from the title and task input
	titleInput.removeAttribute("hidden");
	newTaskInput.removeAttribute("hidden");

	// Remove the hidden attribute from the tell me what to do button
	tellMeButton.removeAttribute("hidden");
}

// The function that redirects to the page that shows lists
function tellMeWhatToDo() {
	// Save the current list in localstorage
	var stringList = JSON.stringify(currentList);
	window.sessionStorage.setItem("list", stringList);

	// Redirect to the taskViewer page
	window.location.href = "test2.html";
}

function deleteTask(listIndex) {
	// Get the list of all tasks
	var todoList = document.getElementById("listTasks").getElementsByTagName("li");

	// Get the task to delete
	var deletedTask = document.getElementById("liItemNumber_" + listIndex);

	// Remove the task from the currentList object
	currentList.tasks.splice(listIndex, 1);

	// Update the local list object
	window[listID] = currentList;

	// Update the firestore doc with the new task by sending in the currentList object
	dbRef.doc(currentList.id).set(currentList);

	// Load the updated list
	loadList(listID);
}