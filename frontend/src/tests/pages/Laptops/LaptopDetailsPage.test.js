import { render, screen, waitFor } from "@testing-library/react";
import LaptopDetailsPage from "main/pages/Laptops/LaptopDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { laptopFixtures } from "fixtures/laptopFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
	const originalModule = jest.requireActual('react-router-dom');
	return {
		__esModule: true,
		...originalModule,
		useParams: () => ({
			id: 1
		}),
		Navigate: (x) => { mockNavigate(x); return null; }
	};
});

describe("LaptopDetailsPage tests", () => {

	const axiosMock = new AxiosMockAdapter(axios);

	const setupUserOnly = () => {
		axiosMock.reset();
		axiosMock.resetHistory();
		axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
		axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
	};

	test("renders without crashing", async () => {
		const queryClient = new QueryClient();
		setupUserOnly();
		axiosMock.onGet("/api/laptops").timeout();

		const restoreConsole = mockConsole();

		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<LaptopDetailsPage />
				</MemoryRouter>
			</QueryClientProvider>
		);

		await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

		const errorMessage = console.error.mock.calls[0][0];
		expect(errorMessage).toMatch("Error communicating with backend via GET on /api/laptops");
		restoreConsole();
	});

	test("loads the correct fields, and no buttons", async () => {
		const queryClient = new QueryClient();
		const laptop = laptopFixtures.oneLaptop[0];
		setupUserOnly();
		axiosMock.onGet("/api/laptops", { params: { id: 1 } }).reply(200, laptop);

		const { getByTestId, findByTestId } = render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<LaptopDetailsPage />
				</MemoryRouter>
			</QueryClientProvider>
		);

		await findByTestId("LaptopTable-cell-row-0-col-id");

		const idField = getByTestId("LaptopTable-cell-row-0-col-id");
		const nameField = getByTestId("LaptopTable-cell-row-0-col-name");
		const cpuField = getByTestId("LaptopTable-cell-row-0-col-cpu");
		const gpuField = getByTestId("LaptopTable-cell-row-0-col-gpu");
		const descriptionField = getByTestId("LaptopTable-cell-row-0-col-description")

		expect(idField).toHaveTextContent(laptop.id);
		expect(nameField).toHaveTextContent(laptop.name);
		expect(cpuField).toHaveTextContent(laptop.cpu);
		expect(gpuField).toHaveTextContent(laptop.gpu);
		expect(descriptionField).toHaveTextContent(laptop.description);

		expect(screen.queryByText("Delete")).toBeNull();
		expect(screen.queryByText("Edit")).toBeNull();
		expect(screen.queryByText("Details")).toBeNull();
	});

});


