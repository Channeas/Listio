var menuOut = true;
var listLocation = document.getElementById("listContentUl");
var listObject1241 = {title: "myTitle", tasks: ["create", "this", "software", "now"], completed: ["this", "task", "is", "completed"]};
var newTaskInput = document.getElementById("listInput");
var /*listID,*/ newList, currentList;
var currentListIndex = 0;
var listID = "KVtzEYM9eJaeoiSHtuhL";
var listObjectExample = {
	title: "none",
	tasks: [],
	completed: []
}

var skip = 0;

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
				currentData.id = currentDocID;
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
	document.getElementById("title").value = "";

	// Fix what is hidden on the page
	unHide()

	// Create a new firestore document
	newList = dbRef.doc();
	newList.set(listObjectExample);

	newList.get().then(function(doc) {
		// Set teh currentData object to be be and empty list object
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

		listID = loadListID;

		// Fix what is hidden on the page
		unHide()

		console.log(loadListID);

		// Set the title
		var titleLocation = document.getElementById("title");
		titleLocation.value = loadListID.title;

		// Append all the tasks to the listLocation
		loadListID.tasks.forEach(function(element) {
			// Create the li element
			var crLiElement = document.createElement("ul");
			crLiElement.setAttribute("class", "listContentLi");
			crLiElement.setAttribute("id", "liItemNumber_" + currentListIndex);
			// crLiElement.setAttribute("id",)

			// Create the <p> element
			var crPElement = document.createElement("p");
			crPElement.setAttribute("class", "actualListText");
			crPElement.setAttribute("contenteditable", "true");
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
			currentListIndex += 1;
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
	dbRef.doc(currentList.id).set(currentList);

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
	dbRef.doc(currentList.id).set(currentList);

	// Update the list of lists to display the right title
	document.getElementById(currentList.id + "_list").innerHTML = newTitle;
}

// Removes the hidden attribute from the title and new task input as well as hides the no list selected message
function unHide() {
	// Remove the hidden tag attribute from the title and task input
	var titleInput = document.getElementById("title");
	titleInput.removeAttribute("hidden");
	newTaskInput.removeAttribute("hidden");

	// Remove the hidden attribute from the tell me what to do button
	var tellMeButton = document.getElementById("tellMeButton");
	tellMeButton.removeAttribute("hidden");
}

// The button that unhides the tellMe overlay
function tellMeWhatToDo() {
	/*var overlay = document.getElementById("tellMeOverlay");
	overlay.removeAttribute("hidden");
	console.log("Code");*/

	// Save the current list in localstorage
	var stringList = JSON.stringify(currentList);
	window.sessionStorage.setItem("list", stringList);

	// Redirect to the taskViewer page
	window.location.href = "test2.html";
}

function overlayTaskDone() {
	console.log("Task complete");
	console.log("Completed task:" + currentList.tasks[skip]);
	skip +=1;
} 

function deleteTask(listIndex) {
	var deletedTask = document.getElementById("liItemNumber_" + listIndex);
	console.log(listIndex);
	currentList.tasks.splice(listIndex, 1);
	deletedTask.parentNode.removeChild(deletedTask);

	// Update the local list object
	window[listID] = currentList;

	// Update the firestore doc with the new task by sending in the currentList object
	dbRef.doc(currentList.id).set(currentList);
}