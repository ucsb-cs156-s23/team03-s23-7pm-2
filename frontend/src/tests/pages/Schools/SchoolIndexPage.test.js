import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import SchoolsIndexPage from "main/pages/Schools/SchoolIndexPage";


import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { schoolFixtures } from "fixtures/schoolFixtures";
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

describe("SchoolsIndexPage tests", () => {

	const axiosMock = new AxiosMockAdapter(axios);

	const testId = "SchoolTable";

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
		axiosMock.onGet("/api/schools/all").reply(200, []);

		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<SchoolsIndexPage />
				</MemoryRouter>
			</QueryClientProvider>
		);


	});

	test("renders without crashing for admin user", () => {
		setupAdminUser();
		const queryClient = new QueryClient();
		axiosMock.onGet("/api/schools/all").reply(200, []);

		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<SchoolsIndexPage />
				</MemoryRouter>
			</QueryClientProvider>
		);


	});

	test("renders three schools without crashing for regular user", async () => {
		setupUserOnly();
		const queryClient = new QueryClient();
		axiosMock.onGet("/api/schools/all").reply(200, schoolFixtures.threeSchools);

		const { getByTestId } = render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<SchoolsIndexPage />
				</MemoryRouter>
			</QueryClientProvider>
		);

		await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2"); });
		expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
		expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");

	});

	test("renders three schools without crashing for admin user", async () => {
		setupAdminUser();
		const queryClient = new QueryClient();
		axiosMock.onGet("/api/schools/all").reply(200, schoolFixtures.threeSchools);

		const { getByTestId } = render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<SchoolsIndexPage />
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
		axiosMock.onGet("/api/schools/all").timeout();

		const restoreConsole = mockConsole();

		const { queryByTestId } = render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<SchoolsIndexPage />
				</MemoryRouter>
			</QueryClientProvider>
		);

		await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

		const errorMessage = console.error.mock.calls[0][0];
		expect(errorMessage).toMatch("Error communicating with backend via GET on /api/schools/all");
		restoreConsole();

		expect(queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
	});

	test("what happens when you click delete, admin", async () => {
		setupAdminUser();

		const queryClient = new QueryClient();
		axiosMock.onGet("/api/schools/all").reply(200, schoolFixtures.threeSchools);
		axiosMock.onDelete("/api/schools").reply(200, "School with id 2 was deleted");


		const { getByTestId } = render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<SchoolsIndexPage />
				</MemoryRouter>
			</QueryClientProvider>
		);


		await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

		expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");


		const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
		expect(deleteButton).toBeInTheDocument();

		fireEvent.click(deleteButton);

		await waitFor(() => { expect(mockToast).toBeCalledWith("School with id 2 was deleted") });

	});

});


