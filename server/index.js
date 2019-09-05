const io = require("socket.io");

const server = io.listen(3000);

let admin = null;

server.on("connection", socket => {
	socket.emit("welcome", "welcome");

	socket.on("champion", champion => {
		admin && admin.emit("champion", JSON.parse(champion));
	});

	socket.on("admin", () => {
		if (admin) {
			console.error("There is already an admin");
			return;
		}
		console.log("New admin:", socket.id);
		admin = socket;
	});

	socket.on("disconnect", () => {
		if (admin === socket) {
			console.log("Admin disconnected:", socket.id);
			admin = null;
		}
	});
});
