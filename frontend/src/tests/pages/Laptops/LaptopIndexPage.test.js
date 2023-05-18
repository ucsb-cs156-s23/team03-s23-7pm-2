import { render, screen, waitFor } from "@testing-library/react";
import LaptopIndexPage from "main/pages/Laptops/LaptopIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockNavigate
}));

const mockDelete = jest.fn();
jest.mock('main/utils/laptopUtils', () => {
	return {
		__esModule: true,
		laptopUtils: {
			del: (id) => {
				return mockDelete(id);
			},
			get: () => {
				return {
					nextId: 5,
					laptops: [
						{
							"id": 3,  // https://www.dell.com/en-us/shop/dell-laptops/alienware-m18-gaming-laptop/spd/alienware-m18-r1-laptop
							"name": "Alienware m18",
							"cpu": "Intel Core i7-13650HX",
							"gpu": "NVIDIA GeForce RTX 4050 Laptop",
							"description": "Extremely fast but expensive" 
						},
					]
				}
			}
		}
	}
});


describe("LaptopIndexPage tests", () => {

	const queryClient = new QueryClient();
	test("renders without crashing", () => {
		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<LaptopIndexPage />
				</MemoryRouter>
			</QueryClientProvider>
		);
	});

	test("renders correct fields", () => {
		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<LaptopIndexPage />
				</MemoryRouter>
			</QueryClientProvider>
		);

		const createLaptopButton = screen.getByText("Create Laptop");
		expect(createLaptopButton).toBeInTheDocument();
		expect(createLaptopButton).toHaveAttribute("style", "float: right;");

		const name = screen.getByText("Alienware m18");
		expect(name).toBeInTheDocument();

		const description = screen.getByText("Extremely fast but expensive");
		expect(description).toBeInTheDocument();

		expect(screen.getByTestId("LaptopTable-cell-row-0-col-Delete-button")).toBeInTheDocument();
		expect(screen.getByTestId("LaptopTable-cell-row-0-col-Details-button")).toBeInTheDocument();
		expect(screen.getByTestId("LaptopTable-cell-row-0-col-Edit-button")).toBeInTheDocument();
	});

	test("delete button calls delete and reloads page", async () => {

		const restoreConsole = mockConsole();

		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<LaptopIndexPage />
				</MemoryRouter>
			</QueryClientProvider>
		);

		const name = screen.getByText("Alienware m18");
		expect(name).toBeInTheDocument();

		const description = screen.getByText("Extremely fast but expensive");
		expect(description).toBeInTheDocument();

		const deleteButton = screen.getByTestId("LaptopTable-cell-row-0-col-Delete-button");
		expect(deleteButton).toBeInTheDocument();

		deleteButton.click();

		expect(mockDelete).toHaveBeenCalledTimes(1);
		expect(mockDelete).toHaveBeenCalledWith(3);

		await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/laptops"));


		// assert - check that the console.log was called with the expected message
		expect(console.log).toHaveBeenCalled();
		const message = console.log.mock.calls[0][0];
		const expectedMessage = `LaptopIndexPage deleteCallback: {"id":3,"name":"Alienware m18","cpu":"Intel Core i7-13650HX","gpu":"NVIDIA GeForce RTX 4050 Laptop","description":"Extremely fast but expensive"}`;
		expect(message).toMatch(expectedMessage);
		restoreConsole();

	});

});


