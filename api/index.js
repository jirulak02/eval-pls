require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

if (process.env.NODE_ENV !== "production") {
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
}
app.use(bodyParser.urlencoded({ extended: false }));

const rootDir = path.join(__dirname, "..");

app.get("/", (req, res) => {
	res.sendFile(rootDir + "/public/index.html");
});

app.listen(3000, () => {
	console.log("\x1b[32m%s\x1b[0m", "Server is running on http://127.0.0.1:3000/");
	console.log("\x1b[36m%s\x1b[0m", "Close the server with CTRL + C");
});

module.exports = app;
