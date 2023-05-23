import { schoolFixtures } from "fixtures/schoolFixtures";
import { schoolUtils } from "main/utils/schoolUtils";

describe("schoolUtils tests", () => {
    // return a function that can be used as a mock implementation of getItem
    // the value passed in will be convertd to JSON and returned as the value
    // for the key "schools".  Any other key results in an error
    const createGetItemMock = (returnValue) => (key) => {
        if (key === "schools") {
            return JSON.stringify(returnValue);
        } else {
            throw new Error("Unexpected key: " + key);
        }
    };

    describe("get", () => {

        test("When schools is undefined in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(undefined));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = schoolUtils.get();

            // assert
            const expected = { nextId: 1, schools: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("schools", expectedJSON);
        });

        test("When schools is null in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(null));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = schoolUtils.get();

            // assert
            const expected = { nextId: 1, schools: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("schools", expectedJSON);
        });

        test("When schools is [] in local storage, should return []", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, schools: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = schoolUtils.get();

            // assert
            const expected = { nextId: 1, schools: [] };
            expect(result).toEqual(expected);

            expect(setItemSpy).not.toHaveBeenCalled();
        });

        test("When schools is JSON of three schools, should return that JSON", () => {

            // arrange
            const threeschools = schoolFixtures.threeschools;
            const mockschoolCollection = { nextId: 10, schools: threeschools };

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(mockschoolCollection));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = schoolUtils.get();

            // assert
            expect(result).toEqual(mockschoolCollection);
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });


    describe("getById", () => {
        test("Check that getting a school by id works", () => {

            // arrange
            const threeschools = schoolFixtures.threeSchools;
            const idToGet = threeschools[1].id;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, schools: threeschools }));

            // act
            const result = schoolUtils.getById(idToGet);

            // assert

            const expected = { school: threeschools[1] };
            expect(result).toEqual(expected);
        });

        test("Check that getting a non-existing school returns an error", () => {

            // arrange
            const threeSchools = schoolFixtures.threeSchools;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, schools: threeSchools }));

            // act
            const result = schoolUtils.getById(99);

            // assert
            const expectedError = `school with id 99 not found`
            expect(result).toEqual({ error: expectedError });
        });

        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeSchools = schoolFixtures.threeSchools;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, schools: threeSchools }));

            // act
            const result = schoolUtils.getById();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });

    });
    describe("add", () => {
        test("Starting from [], check that adding one school works", () => {

            // arrange
            const school = schoolFixtures.oneSchool[0];
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, schools: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = schoolUtils.add(school);

            // assert
            expect(result).toEqual(school);
            expect(setItemSpy).toHaveBeenCalledWith("schools",
                JSON.stringify({ nextId: 2, schools: schoolFixtures.oneSchool }));
        });
    });

    describe("update", () => {
        test("Check that updating an existing school works", () => {

            // arrange
            const threeSchools = schoolFixtures.threeSchools;
            const updatedSchool = {
                ...threeSchools[0],
                name: "Updated Name"
            };
            const threeSchoolsUpdated = [
                updatedSchool,
                threeSchools[1],
                threeSchools[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, schools: threeSchools }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = schoolUtils.update(updatedSchool);

            // assert
            const expected = { schoolCollection: { nextId: 5, schools: threeSchoolsUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("schools", JSON.stringify(expected.schoolCollection));
        });
        test("Check that updating an non-existing school returns an error", () => {

            // arrange
            const threeSchools = schoolFixtures.threeSchools;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, schools: threeSchools }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            const updatedSchool = {
                id: 99,
                name: "Fake Name",
                description: "Fake Description"
            }

            // act
            const result = schoolUtils.update(updatedSchool);

            // assert
            const expectedError = `school with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });

    describe("del", () => {
        test("Check that deleting a school by id works", () => {

            // arrange
            const threeSchools = schoolFixtures.threeSchools;
            const idToDelete = threeSchools[1].id;
            const threeSchoolsUpdated = [
                threeSchools[0],
                threeSchools[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, schools: threeSchools }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = schoolUtils.del(idToDelete);

            // assert

            const expected = { schoolCollection: { nextId: 5, schools: threeSchoolsUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("schools", JSON.stringify(expected.schoolCollection));
        });
        test("Check that deleting a non-existing school returns an error", () => {

            // arrange
            const threeSchools = schoolFixtures.threeSchools;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, schools: threeSchools }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = schoolUtils.del(99);

            // assert
            const expectedError = `school with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeSchools = schoolFixtures.threeSchools;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, schools: threeSchools }));

            // act
            const result = schoolUtils.del();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });
    });
});

