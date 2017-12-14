function createList() {
	console.log("Creating new list");

	// Set the sessionstorage listID to be "null"
	window.sessionStorage.setItem("listID", "null");

	window.location.href="editList.html";
}