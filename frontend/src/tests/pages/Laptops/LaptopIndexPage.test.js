import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import LaptopsIndexPage from "main/pages/Laptops/LaptopIndexPage";


import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { laptopFixtures } from "fixtures/laptopFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";


const mockToast = jest.fn();
jest.mock('react-toastify', () => {
	const originalModule = jest.requireActual('react-toastify');
	return {
		__esModule: true,
		...originalModule,
		toast: (x) => mockToast(x)
	};
});

describe("LaptopsIndexPage tests", () => {

	const axiosMock = new AxiosMockAdapter(axios);

	const testId = "LaptopTable";

	const setupUserOnly = () => {
		axiosMock.reset();
		axiosMock.resetHistory();
		axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
		axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
	};

	const setupAdminUser = () => {
		axiosMock.reset();
		axiosMock.resetHistory();
		axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
		axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
	};

	test("renders without crashing for regular user", () => {
		setupUserOnly();
		const queryClient = new QueryClient();
		axiosMock.onGet("/api/laptops/all").reply(200, []);

		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<LaptopsIndexPage />
				</MemoryRouter>
			</QueryClientProvider>
		);


	});

	test("renders without crashing for admin user", () => {
		setupAdminUser();
		const queryClient = new QueryClient();
		axiosMock.onGet("/api/laptops/all").reply(200, []);

		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<LaptopsIndexPage />
				</MemoryRouter>
			</QueryClientProvider>
		);


	});

	test("renders three laptops without crashing for regular user", async () => {
		setupUserOnly();
		const queryClient = new QueryClient();
		axiosMock.onGet("/api/laptops/all").reply(200, laptopFixtures.threeLaptops);

		const { getByTestId } = render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<LaptopsIndexPage />
				</MemoryRouter>
			</QueryClientProvider>
		);

		await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2"); });
		expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
		expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");

	});

	test("renders three laptops without crashing for admin user", async () => {
		setupAdminUser();
		const queryClient = new QueryClient();
		axiosMock.onGet("/api/laptops/all").reply(200, laptopFixtures.threeLaptops);

		const { getByTestId } = render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<LaptopsIndexPage />
				</MemoryRouter>
			</QueryClientProvider>
		);

		await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2"); });
		expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
		expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");

	});

	test("renders empty table when backend unavailable, user only", async () => {
		setupUserOnly();

		const queryClient = new QueryClient();
		axiosMock.onGet("/api/laptops/all").timeout();

		const restoreConsole = mockConsole();

		const { queryByTestId } = render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<LaptopsIndexPage />
				</MemoryRouter>
			</QueryClientProvider>
		);

		await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

		const errorMessage = console.error.mock.calls[0][0];
		expect(errorMessage).toMatch("Error communicating with backend via GET on /api/laptops/all");
		restoreConsole();

		expect(queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
	});

	test("what happens when you click delete, admin", async () => {
		setupAdminUser();

		const queryClient = new QueryClient();
		axiosMock.onGet("/api/laptops/all").reply(200, laptopFixtures.threeLaptops);
		axiosMock.onDelete("/api/laptops").reply(200, "Laptop with id 2 was deleted");


		const { getByTestId } = render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<LaptopsIndexPage />
				</MemoryRouter>
			</QueryClientProvider>
		);


		await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

		expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");


		const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
		expect(deleteButton).toBeInTheDocument();

		fireEvent.click(deleteButton);

		await waitFor(() => { expect(mockToast).toBeCalledWith("Laptop with id 2 was deleted") });

	});

});


