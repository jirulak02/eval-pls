const path = require("path");
const express = require("express");
const app = express();
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
	setTimeout(() => {
		liveReloadServer.refresh("/");
	}, 100);
});

app.use(connectLiveReload());
app.use(express.static("public"));

const root = path.join(__dirname, "..");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// This data would normally be stored in a database
let formData = {
	firstName: "Joe",
	lastName: "Blow",
	email: "joe@blow.com",
};

app.get("/contact/1", (req, res) => {
	const form = `<div hx-target="this" hx-swap="outerHTML">
	<div><label>First Name</label>: ${formData.firstName}</div>
	<div><label>Last Name</label>: ${formData.lastName}</div>
	<div><label>Email Address</label>: ${formData.email}</div>
	<button hx-get="/contact/1/edit">
	Click To Edit
	</button></div>`;
	res.send(form);
});
app.put("/contact/1", (req, res) => {
	formData = req.body;
	const form = `<div hx-target="this" hx-swap="outerHTML">
	<div><label>First Name</label>: ${formData.firstName}</div>
	<div><label>Last Name</label>: ${formData.lastName}</div>
	<div><label>Email Address</label>: ${formData.email}</div>
	<button hx-get="/contact/1/edit">
	Click To Edit
	</button></div>`;
	res.send(form);
});
app.get("/contact/1/edit", (req, res) => {
	const form = `<form hx-put="/contact/1" hx-target="this" hx-swap="outerHTML">
	<div>
		<label for="firstName">First Name</label>
		<input autofocus type="text" id="firstName" name="firstName" value="${formData.firstName}">
	</div>
	<div class="form-group">
		<label for="lastName">Last Name</label>
		<input type="text" id="lastName" name="lastName" value="${formData.lastName}">
	</div>
	<div class="form-group">
		<label for="email">Email Address</label>
		<input type="email" id="email" name="email" value="${formData.email}">
	</div>
	<button type="submit">Submit</button>
	<button hx-get="/contact/1">Cancel</button></form>`;
	res.send(form);
});

app.get("/", (req, res) => {
	res.sendFile(root + "/public/index.html");
});

app.listen(3000, () => {
	console.log("\x1b[32m%s\x1b[0m", "Server is running on http://127.0.0.1:3000/");
	console.log("\x1b[36m%s\x1b[0m", "Close the server with CTRL + C");
});

module.exports = app;
