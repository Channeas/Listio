var list, currentTask;
var taskIndex = 0;
var taskDisplayLocation = document.getElementById("taskDisplay");

// The onload that get's the list from the localStorage
window.onload = getList();


// The reference point in the database. Note that when creating user specific databases it will be required to do this in the firebase.onAuthStateChanged
dbRef = firestore.collection("users").doc("test").collection("lists");

// The function that get's the list from the localStorage
function getList() {
	// Saves the list string in the localStorage as a variable
	var stringList = window.sessionStorage.getItem("list");

	// Turns the string into an object
	list = JSON.parse(stringList);
	// Logs the list
	console.log(list);

	// Displays the first task
	taskDisplay.innerHTML = list.tasks[taskIndex];

	// Set's what the currentTask is
	currentTask = list.tasks[taskIndex];
}

// The function that marks a task as done
function taskDone() {
	// Checks if there are more tasks
	if(taskIndex+1 < list.tasks.length) {
		// Logs that a task was completed and logs what task it was
		console.log("Task complete");
		console.log("Completed task: " + list.tasks[taskIndex]);

		// Adds the class that changes the color of the taskAction div to green
		document.getElementById("taskAction").className = "taskAction2";

		// Changes the color of the task displayed to white
		taskDisplayLocation.style.color = "#fff";

		// Sets a timeout before loading the new task
		window.setTimeout(resetDisplay, 2000);
		
		// Removes the task from undone tasks
		list.tasks.splice(taskIndex, 1);
		
		// Adds the task as completed
		list.completed.push(currentTask);

		// Update the firestore doc with the new task by sending in the list object
		dbRef.doc(list.id).set(list);

		// Update the localstorage
		var stringList = JSON.stringify(list);
		window.sessionStorage.setItem("list", stringList);
	} else {
		// Log that all tasks in the list are completed
		console.log("All tasks in list complete");

		// Displays that all tasks are completed
		taskDisplay.innerHTML = "All tasks in list complete";

		// Removes the task from undone tasks
		list.tasks.splice(taskIndex, 1);

		// Adds the task as completed
		list.completed.push(currentTask);

		// Adds the color of success to the background
		document.getElementById("taskAction").className = "taskAction2";

		// Changes the color of the text displayed to white
		taskDisplayLocation.style.color = "#fff";

		// Update the firestore doc with the new task by sending in the list object
		dbRef.doc(list.id).set(list);

		// Update the localstorage
		var stringList = JSON.stringify(list);
		window.sessionStorage.setItem("list", stringList);
	}
} 

function resetDisplay() {
	// Changes back the color of the task displayed to black
	taskDisplayLocation.style.color = "#000";

	// Removes the background color
	document.getElementById("taskAction").className = "";

	// Saves the new currentTask
	currentTask = list.tasks[taskIndex];

	// Displays the new task
	taskDisplay.innerHTML = list.tasks[taskIndex];
}

// The function that skips a task
function skipTask() {
	// Adds the class that changes the color of the taskAction div to red
	document.getElementById("taskAction").className = "taskAction3";

	// Changes the color of the task displayed to white
	taskDisplayLocation.style.color = "#fff";

	// Increments one to the taskIndex
	taskIndex += 1;

	// Sets a timeout before loading the new task
	window.setTimeout(resetDisplay, 2000);
}

// The function to quit the page that displays tasks
function quit() {
	// Redirect to the index page
	window.location.href = "test.html";
}