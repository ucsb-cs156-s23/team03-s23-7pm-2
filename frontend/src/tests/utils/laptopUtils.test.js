import { laptopUtils } from "main/utils/laptopUtils";
import { laptopFixtures } from "fixtures/laptopFixtures";

describe("laptopUtils tests", () => {
	// return a function that can be used as a mock implementation of getItem
	// the value passed in will be convertd to JSON and returned as the value
	// for the key "restaurants".  Any other key results in an error
	const createGetItemMock = (returnValue) => (key) => {
		if (key === "laptops") {
			return JSON.stringify(returnValue);
		} else {
			throw new Error("Unexpected key: " + key);
		}
	};

	describe("get", () => {

		test("When laptops is undefined in local storage, should set to empty list", () => {

			// arrange
			const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
			getItemSpy.mockImplementation(createGetItemMock(undefined));

			const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
			setItemSpy.mockImplementation((_key, _value) => null);

			// act
			const result = laptopUtils.get();

			// assert
			const expected = { nextId: 1, laptops: [] };
			expect(result).toEqual(expected);

			const expectedJSON = JSON.stringify(expected);
			expect(setItemSpy).toHaveBeenCalledWith("laptops", expectedJSON);
		});

		test("When laptops is null in local storage, should set to empty list", () => {

			// arrange
			const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
			getItemSpy.mockImplementation(createGetItemMock(null));

			const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
			setItemSpy.mockImplementation((_key, _value) => null);

			// act
			const result = laptopUtils.get();

			// assert
			const expected = { nextId: 1, laptops: [] };
			expect(result).toEqual(expected);

			const expectedJSON = JSON.stringify(expected);
			expect(setItemSpy).toHaveBeenCalledWith("laptops", expectedJSON);
		});

		test("When laptops is [] in local storage, should return []", () => {

			// arrange
			const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
			getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, laptops: [] }));

			const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
			setItemSpy.mockImplementation((_key, _value) => null);

			// act
			const result = laptopUtils.get();

			// assert
			const expected = { nextId: 1, laptops: [] };
			expect(result).toEqual(expected);

			expect(setItemSpy).not.toHaveBeenCalled();
		});

		test("When laptops is JSON of three laptops, should return that JSON", () => {

			// arrange
			const threeLaptops = laptopFixtures.threeLaptops;
			const mockLaptopCollection = { nextId: 10, laptops: threeLaptops };

			const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
			getItemSpy.mockImplementation(createGetItemMock(mockLaptopCollection));

			const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
			setItemSpy.mockImplementation((_key, _value) => null);

			// act
			const result = laptopUtils.get();

			// assert
			expect(result).toEqual(mockLaptopCollection);
			expect(setItemSpy).not.toHaveBeenCalled();
		});
	});


	describe("getById", () => {
		test("Check that getting a laptop by id works", () => {

			// arrange
			const threeLaptops = laptopFixtures.threeLaptops;
			const idToGet = threeLaptops[1].id;

			const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
			getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, laptops: threeLaptops }));

			// act
			const result = laptopUtils.getById(idToGet);

			// assert

			const expected = { laptop: threeLaptops[1] };
			expect(result).toEqual(expected);
		});

		test("Check that getting a non-existing laptop returns an error", () => {

			// arrange
			const threeLaptops = laptopFixtures.threeLaptops;

			const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
			getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, laptops: threeLaptops }));

			// act
			const result = laptopUtils.getById(99);

			// assert
			const expectedError = `laptop with id 99 not found`
			expect(result).toEqual({ error: expectedError });
		});

		test("Check that an error is returned when id not passed", () => {

			// arrange
			const threeLaptops = laptopFixtures.threeLaptops;

			const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
			getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, laptops: threeLaptops }));

			// act
			const result = laptopUtils.getById();

			// assert
			const expectedError = `id is a required parameter`
			expect(result).toEqual({ error: expectedError });
		});

	});
	describe("add", () => {
		test("Starting from [], check that adding one laptop works", () => {

			// arrange
			const laptop = laptopFixtures.oneLaptop[0];
			const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
			getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, laptops: [] }));

			const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
			setItemSpy.mockImplementation((_key, _value) => null);

			// act
			const result = laptopUtils.add(laptop);

			// assert
			expect(result).toEqual(laptop);
			expect(setItemSpy).toHaveBeenCalledWith("laptops",
				JSON.stringify({ nextId: 2, laptops: laptopFixtures.oneLaptop }));
		});
	});

	describe("update", () => {
		test("Check that updating an existing restaurant works", () => {

			// arrange
			const threeLaptops = laptopFixtures.threeLaptops;
			const updatedLaptop = {
				...threeLaptops[0],
				name: "Updated Name"
			};
			const threeLaptopsUpdated = [
				updatedLaptop,
				threeLaptops[1],
				threeLaptops[2]
			];

			const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
			getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, laptops: threeLaptops }));

			const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
			setItemSpy.mockImplementation((_key, _value) => null);

			// act
			const result = laptopUtils.update(updatedLaptop);

			// assert
			const expected = { laptopCollection: { nextId: 5, laptops: threeLaptopsUpdated } };
			expect(result).toEqual(expected);
			expect(setItemSpy).toHaveBeenCalledWith("laptops", JSON.stringify(expected.laptopCollection));
		});
		test("Check that updating an non-existing laptop returns an error", () => {

			// arrange
			const threeLaptops = laptopFixtures.threeLaptops;

			const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
			getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, laptops: threeLaptops }));

			const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
			setItemSpy.mockImplementation((_key, _value) => null);

			const updatedLaptop = {
				id: 99,
				name: "Fake Name",
				description: "Fake Description"
			}

			// act
			const result = laptopUtils.update(updatedLaptop);

			// assert
			const expectedError = `laptop with id 99 not found`
			expect(result).toEqual({ error: expectedError });
			expect(setItemSpy).not.toHaveBeenCalled();
		});
	});

	describe("del", () => {
		test("Check that deleting a laptop by id works", () => {

			// arrange
			const threeLaptops = laptopFixtures.threeLaptops;
			const idToDelete = threeLaptops[1].id;
			const threeLaptopsUpdated = [
				threeLaptops[0],
				threeLaptops[2]
			];

			const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
			getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, laptops: threeLaptops }));

			const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
			setItemSpy.mockImplementation((_key, _value) => null);

			// act
			const result = laptopUtils.del(idToDelete);

			// assert

			const expected = { laptopCollection: { nextId: 5, laptops: threeLaptopsUpdated} };
			expect(result).toEqual(expected);
			expect(setItemSpy).toHaveBeenCalledWith("laptops", JSON.stringify(expected.laptopCollection));
		});
		test("Check that deleting a non-existing laptop returns an error", () => {

			// arrange
			const threeLaptops = laptopFixtures.threeLaptops;

			const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
			getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, laptops: threeLaptops }));

			const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
			setItemSpy.mockImplementation((_key, _value) => null);

			// act
			const result = laptopUtils.del(99);

			// assert
			const expectedError = `laptop with id 99 not found`
			expect(result).toEqual({ error: expectedError });
			expect(setItemSpy).not.toHaveBeenCalled();
		});
		test("Check that an error is returned when id not passed", () => {

			// arrange
			const threeLaptops = laptopFixtures.threeLaptops;

			const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
			getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, laptops: threeLaptops }));

			// act
			const result = laptopUtils.del();

			// assert
			const expectedError = `id is a required parameter`
			expect(result).toEqual({ error: expectedError });
		});
	});
});

