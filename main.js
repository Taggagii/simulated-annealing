window.onload = () => {
	const canvas = document.getElementById('canvas')
	const context = canvas.getContext('2d')

	const radius = 2;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;


	const dot = (coord) => {
		context.fillStyle = 'black';
		context.beginPath();
		context.arc(...coord, radius, 0, 2 * Math.PI, false);
		context.fill()
	}

	const randomCoord = () => {
		return [Math.floor(Math.random() * width), Math.floor(Math.random() * height)];
	}

	const line = (coord1, coord2) => {
		context.strokeStyle = 'black';
		context.beginPath();
		context.moveTo(...coord1);
		context.lineTo(...coord2);
		context.stroke();
	}

	const clear = () => {
		context.fillStyle = 'white';
		context.beginPath();
		context.fillRect(0, 0, width, height);
		context.fill()
	}


	const n = 500;
	const points = [];
	for (let i = 0; i < n; ++i) {
		points.push(randomCoord())
	}

	points.forEach(dot);

	let ordering = [];
	for (let i = 0; i < n; ++i) {
		ordering.push(n - i - 1);
	}

	const swap = (a, b) => {
		ordering[a] ^= ordering[b];
		ordering[b] ^= ordering[a];
		ordering[a] ^= ordering[b];
	}

	function shuffle(array) {
	  let currentIndex = array.length;

	  // While there remain elements to shuffle...
	  while (currentIndex != 0) {

		// Pick a remaining element...
		let randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
		  array[randomIndex], array[currentIndex]];
	  }
	}


	const twoUniquePoints = () => {
		const values = [];
		for (let i = 0; i < n; ++i) {
			values.push(i);
		}

		shuffle(values);

		//const first = Math.floor(Math.random() * n);
		//
		//let second = Math.floor(Math.random() * n);
		//
		//while (second === first) {
		//	second = Math.floor(Math.random() * n);
		//}

		return [values[0], values[1]];
	}


	const showOrdering = () => {
		context.fillStyle = 'black';
		context.beginPath();
		context.moveTo(...points[ordering[0]]);
		ordering.forEach((order) => context.lineTo(...points[order]));
		context.lineTo(...points[ordering[0]]);
		context.stroke();
	}

	const calculateDist = (a, b) => {
		const x = points[a][0] - points[b][0];
		const y = points[a][1] - points[b][1];
		return Math.sqrt(x*x + y*y);
	}

	const calculateCost = () => {
		let total = 0;

		for (let i = 1; i <= n; ++i) {
			total += calculateDist(ordering[i % n], ordering[i - 1]);
		}

		return total;
	}

	let temperature = 1000;
	const tolerance = 0.01;
	const dropoffFactor = 0.996;

	let bestOrdering = [];
	let bestCost = Infinity;

	let pt = 0;
	const loop = (dt) => {
		if (dt - pt > 100) {
			console.log(temperature);
			clear();
			points.forEach(dot);
			showOrdering();
			pt = dt;
		}



		if (temperature < tolerance) {
			ordering = bestOrdering;
			showOrdering();
			return;
		}

		const currentCost = calculateCost();

		//console.log(temperature, currentCost);
		
		const [first, second] = twoUniquePoints();
		swap(first, second);

		const nextCost = calculateCost();

		const diff = nextCost - currentCost;

		if (diff < 0) {
			if (nextCost < bestCost) {
				bestOrdering = structuredClone(ordering);
				bestCost = nextCost;
			}
		} else {
			if (Math.random() >= Math.exp(-diff / temperature)) {
				swap(first, second); // swap back if not selected
			}
		}

		temperature *= dropoffFactor;
			


		window.requestAnimationFrame(loop);
	}

	loop(0);


	
	
		





}
