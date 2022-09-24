function test() {
	const canvas = document.getElementById("game-canvas");
	addRandomPoints(5000, canvas);
}

function addRandomPoints(numPoints, canvas) {
	const ctx = canvas.getContext("2d");
	let drawn = 0;
	while (drawn < numPoints) {
		const [x, y] = randomPoint(canvas.width, canvas.height);
		ctx.beginPath();
		ctx.arc(x, y, 3, 0, Math.PI * 2);
		ctx.fill();
		drawn++;
	}
}

function randomPoint(w, h) {
	return [(Math.random()) * w, (Math.random()) * h];
}

window.addEventListener("load", test);