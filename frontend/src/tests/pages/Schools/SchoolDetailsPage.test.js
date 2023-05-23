import { render, screen, waitFor } from "@testing-library/react";
import SchoolDetailsPage from "main/pages/Schools/SchoolDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { schoolFixtures } from "fixtures/schoolFixtures";
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

describe("SchoolDetailsPage tests", () => {

	const axiosMock = new AxiosMockAdapter(axios);

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

	test("renders without crashing", async () => {
		const queryClient = new QueryClient();
		setupUserOnly();
		axiosMock.onGet("/api/schools").timeout();

		const restoreConsole = mockConsole();

		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<SchoolDetailsPage />
				</MemoryRouter>
			</QueryClientProvider>
		);

		await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

		const errorMessage = console.error.mock.calls[0][0];
		expect(errorMessage).toMatch("Error communicating with backend via GET on /api/schools");
		restoreConsole();
	});

	test("loads the correct fields, and no buttons", async () => {
		const queryClient = new QueryClient();
		const school = schoolFixtures.oneSchool[0];
		setupAdminUser();
		axiosMock.onGet("/api/schools", { params: { id: 1 } }).reply(200, school);

		const { getByTestId, findByTestId } = render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<SchoolDetailsPage />
				</MemoryRouter>
			</QueryClientProvider>
		);

		await findByTestId("SchoolTable-cell-row-0-col-id");

		const idField = getByTestId("SchoolTable-cell-row-0-col-id");
		const nameField = getByTestId("SchoolTable-cell-row-0-col-name");
		const rankField = getByTestId("SchoolTable-cell-row-0-col-rank");
		const descriptionField = getByTestId("SchoolTable-cell-row-0-col-description")

		expect(idField).toHaveTextContent(school.id);
		expect(nameField).toHaveTextContent(school.name);
		expect(rankField).toHaveTextContent(school.rank);
		expect(descriptionField).toHaveTextContent(school.description);

		expect(screen.queryByText("Delete")).not.toBeInTheDocument();
		expect(screen.queryByText("Edit")).not.toBeInTheDocument();
		expect(screen.queryByText("Details")).not.toBeInTheDocument();
	});

});


