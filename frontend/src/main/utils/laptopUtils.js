// get laptops from local storage
const get = () => {
	const laptopValue = localStorage.getItem("laptops");
	if (laptopValue === undefined) {
		const laptopCollection = { nextId: 1, laptops: [] }
		return set(laptopCollection);
	}
	const laptopCollection = JSON.parse(laptopValue);
	if (laptopCollection === null) {
		const laptopCollection = { nextId: 1, laptops: [] }
		return set(laptopCollection);
	}
	return laptopCollection;
};

const getById = (id) => {
	if (id === undefined) {
		return { "error": "id is a required parameter" };
	}
	const laptopCollection = get();
	const laptops = laptopCollection.laptops;

	/* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
	const index = laptops.findIndex((r) => r.id == id);
	if (index === -1) {
		return { "error": `laptop with id ${id} not found` };
	}
	return { laptop: laptops[index] };
}

// set laptops in local storage
const set = (laptopCollection) => {
	localStorage.setItem("laptops", JSON.stringify(laptopCollection));
	return laptopCollection;
};

// add a laptop to local storage
const add = (laptop) => {
	const laptopCollection = get();
	laptop = { ...laptop, id: laptopCollection.nextId };
	laptopCollection.nextId++;
	laptopCollection.laptops.push(laptop);
	set(laptopCollection);
	return laptop;
};

// update a laptop in local storage
const update = (laptop) => {
	const laptopCollection = get();

	const laptops = laptopCollection.laptops;

	/* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
	const index = laptops.findIndex((r) => r.id == laptop.id);
	if (index === -1) {
		return { "error": `laptop with id ${laptop.id} not found` };
	}
	laptops[index] = laptop;
	set(laptopCollection);
	return { laptopCollection: laptopCollection };
};

// delete a restaurant from local storage
const del = (id) => {
	if (id === undefined) {
		return { "error": "id is a required parameter" };
	}
	const laptopCollection = get();
	const laptops = laptopCollection.laptops;

	/* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
	const index = laptops.findIndex((r) => r.id == id);
	if (index === -1) {
		return { "error": `laptop with id ${id} not found` };
	}
	laptops.splice(index, 1);
	set(laptopCollection);
	return { laptopCollection: laptopCollection };
};

const laptopUtils = {
	get,
	getById,
	add,
	update,
	del
};

export { laptopUtils };
