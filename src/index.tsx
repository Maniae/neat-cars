import * as React from "react";
import ReactDOM from "react-dom";
import { App } from "./app";

const main = document.getElementById("main");
if (!main) {
	throw Error("React root not found");
}

ReactDOM.render(<App />, main);
