const path = require("path");


module.exports = {
	context: __dirname,
	entry: path.resolve("./public_html/src/main.js"),
	output: {
		filename: "bundle.js",
		path: path.resolve("./public_html/dist")
	}
};
