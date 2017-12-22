var list, currentTask;
var taskIndex = 0;
var taskDisplayLocation = document.getElementById("taskDisplay");
window.onload = getList();


// The reference point in the database. Note that when creating user specific databases it will be required to do this in the firebase.onAuthStateChanged
dbRef = firestore.collection("users").doc("test").collection("lists");


function getList() {
	var stringList = window.sessionStorage.getItem("list");
	list = JSON.parse(stringList);
	console.log(list);
	taskDisplay.innerHTML = list.tasks[taskIndex];
	currentTask = list.tasks[taskIndex];
}

function overlayTaskDone() {
	if(taskIndex+1 < list.tasks.length) {
		console.log("Task complete");
		console.log("Completed task: " + list.tasks[taskIndex]);
		document.getElementById("taskAction").className = "taskAction2";
		taskDisplayLocation.style.color = "#fff";
		window.setTimeout(resetDisplay, 2000);
		console.log(currentTask);
		list.completed.push(currentTask);
		list.tasks.splice(taskIndex, 1);
		console.log(list);
		// Update the firestore doc with the new task by sending in the list object
		dbRef.doc(list.id).set(list);

		// Update the localstorage
		var stringList = JSON.stringify(list);
		window.sessionStorage.setItem("list", stringList);
	} else {
		console.log("All tasks in list complete");
		taskDisplay.innerHTML = "All tasks in list complete";
		list.completed.push(currentTask);
		list.tasks.splice(taskIndex, 1);
		document.getElementById("taskAction").className = "taskAction2";
		taskDisplayLocation.style.color = "#fff";
	}
} 

function resetDisplay() {
	console.log("Reset");
	taskDisplayLocation.style.color = "#000";
	document.getElementById("taskAction").className = "";

	currentTask = list.tasks[taskIndex];
	// taskIndex +=1;
	taskDisplay.innerHTML = list.tasks[taskIndex];
}

function skipTask() {
	document.getElementById("taskAction").className = "taskAction3";
	taskDisplayLocation.style.color = "#fff";
	taskIndex += 1;
	window.setTimeout(resetDisplay, 2000);
}

function quit() {
	// Redirect to the taskViewer page
	window.location.href = "test.html";
}