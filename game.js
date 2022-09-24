function test() {
	const canvas = document.getElementById("game-canvas");
	const ctx = canvas.getContext("2d");
	addRandomPoints(5, ctx);
}

function addRandomPoints(numPoints, ctx) {
	let drawn = 0;
	while (drawn < numPoints) {
		const [x, y] = randomPoint();
		ctx.beginPath();
		ctx.arc(1000, 600, 2, 0, Math.PI * 2);
		ctx.fill();
		drawn++;
	}
}

function randomPoint() {
	return [(Math.random()) * 1000, (Math.random()) * 600];
}

window.addEventListener("load", test);