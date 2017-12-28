var menuOut = true;
var listLocation = document.getElementById("listTasks");
var completedLocation = document.getElementById("completedListTasks");
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
	completedLocation.innerHTML = "";

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
	
	// Empty what is currently displayed in the list
	listLocation.innerHTML = "";

	// Empty what is currently displayed in the completed tasks
	completedLocation.innerHTML = "";

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
		});

		// Reverse the completed tasks to display the most recently completed task on top
		var reversedCompleted = loadListID.completed.reverse();

		// Append all the completed tasks
		reversedCompleted.forEach(function(element) {
			// Call the function that appends the completed tasks
			addCompletedTasks(element);
		})
	}
}

// The function that adds tasks
function addTask(element) {
	// Create the li element
	var crLiElement = document.createElement("ul");
	crLiElement.setAttribute("class", "listContentLi");
	crLiElement.setAttribute("id", "liItemNumber_" + currentListIndex);
	// crLiElement.setAttribute("id",)

	// Create the <p> element
	var crPElement = document.createElement("p");
	crPElement.setAttribute("class", "actualListText");
	crPElement.setAttribute("contenteditable", "true");
	crPElement.setAttribute("onkeydown", "taskKeyDown(event, this)");
	crPElement.setAttribute("onfocusout", "changeTask(this)");
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

// The function that appends all the completed tasks
function addCompletedTasks(element) {
	// Create the li element
	var crLiElement = document.createElement("ul");
	crLiElement.setAttribute("class", "listContentLi");

	// Create the <p> element
	var crPElement = document.createElement("p");
	crPElement.setAttribute("class", "actualListText");
	crPElement.innerHTML = element;

	// Append the above elements
	completedLocation.appendChild(crLiElement);
	crLiElement.appendChild(crPElement);
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

	// Call the function that updates the local object and the firebase doc.
	updateList();
	
	} else { // Else log that the user can not create an empty task
		console.log("Can not add an empty task");
	}
}

// Check if enter is pressed in the title input field
function changeTitleListener(event) {
	// Get the keyCode
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

	// Call the function that updates the local object and the firebase doc.
	updateList();

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

	// Remove the hidden attribute from the todoTasks
	document.getElementById("toDoTasks").removeAttribute("hidden");

	// Remove the hidden attribute from the completedTasks
	document.getElementById("completedTasks").removeAttribute("hidden");

	// Remove the hidden attribute from the button that deletes the current list
	document.getElementById("deleteList").removeAttribute("hidden");
}

// Hides all the elements that can be unhidden in the function above
function hide() {
	// Add the hidden tag attribute from the title and task input
	titleInput.setAttribute("hidden", "true");
	newTaskInput.setAttribute("hidden", "true");

	// Add the hidden attribute from the tell me what to do button
	tellMeButton.setAttribute("hidden", "true");

	// Add the hidden attribute from the todoTasks
	document.getElementById("toDoTasks").setAttribute("hidden", "true");

	// Add the hidden attribute from the completedTasks
	document.getElementById("completedTasks").setAttribute("hidden", "true");

	// Add the hidden attribute from the button that deletes the current list
	document.getElementById("deleteList").setAttribute("hidden", "true");

	// Empty the what is currently displayed in the list and empty the title
	listLocation.innerHTML = "";
	titleInput.value = "";
	completedLocation.innerHTML = "";
}

// The function that redirects to the page that shows lists
function tellMeWhatToDo() {
	// Save the current list in localstorage
	var stringList = JSON.stringify(currentList);
	window.sessionStorage.setItem("list", stringList);

	// Redirect to the taskViewer page
	window.location.href = "test2.html";
}

// The function that deletes tasks
function deleteTask(listIndex) {
	// Get the list of all tasks
	var todoList = document.getElementById("listTasks").getElementsByTagName("li");

	// Get the task to delete
	var deletedTask = document.getElementById("liItemNumber_" + listIndex);

	// Remove the task from the currentList object
	currentList.tasks.splice(listIndex, 1);

	// Call the function that updates the local object and the firebase doc.
	updateList();

	// Load the updated list
	loadList(listID);
}


// TODO: make the list index id be sent with the taskKeyDown
// The function that is called on the keydown of every task
function taskKeyDown(event, sender) {
	// Get the keyCode
	var code = event.keyCode;
	// Check if enter was pressed 
	if(code == 13) {
		// Call the function that changes tasks
		changeTask(sender);

		// Prevent the line break from getting added
		event.preventDefault();
	}
}

// The function that changes tasks
function changeTask(sender) {
	// Get the index of the selected task
	index = sender.previousSibling.id;

	// Change the task in the currentList object
	currentList.tasks[index] = sender.innerHTML;

	// Call the function that updates the local object and the firebase doc.
	updateList();
}

// The function that updates the list
function updateList() {
	// Update the local list object
	window[listID] = currentList;

	// Update the firestore doc with the new title by sending in the currentList object
	dbRef.doc(currentList.id).set(currentList);
}

// The function that deletes lists
function deleteList() {
	// Hide basically everything
	hide();

	// Delete the firebase doc of the current list
	dbRef.doc(currentList.id).delete().then(function() {
		console.log("List deleted");
	}).catch(function(error) {
		console.log("Error deleting list: " + error);
	})

	// Remove the list button from the menu
	var deletedList = document.getElementById(currentList.id + "_list");
	deletedList.parentElement.removeChild(deletedList);
}