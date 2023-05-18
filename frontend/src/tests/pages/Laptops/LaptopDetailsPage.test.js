import { render, screen } from "@testing-library/react";
import LaptopDetailsPage from "main/pages/Laptops/LaptopDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: () => ({
		id: 3
	}),
	useNavigate: () => mockNavigate
}));

jest.mock('main/utils/laptopUtils', () => {
	return {
		__esModule: true,
		laptopUtils: {
			getById: (_id) => {
				return {
					laptop: {
						id: 3,
						name: "Alienware m18",
						description: "Extremely fast but expensive"
					}
				}
			}
		}
	}
});

describe("LaptopDetailsPage tests", () => {

	const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither); 

	const queryClient = new QueryClient();
	test("renders without crashing", () => {
		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<LaptopDetailsPage />
				</MemoryRouter>
			</QueryClientProvider>
		);
	});

	test("loads the correct fields, and no buttons", async () => {
		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<LaptopDetailsPage />
				</MemoryRouter>
			</QueryClientProvider>
		);
		expect(screen.getByText("Alienware m18")).toBeInTheDocument();
		expect(screen.getByText("Extremely fast but expensive")).toBeInTheDocument();

		expect(screen.queryByText("Delete")).not.toBeInTheDocument();
		expect(screen.queryByText("Edit")).not.toBeInTheDocument();
		expect(screen.queryByText("Details")).not.toBeInTheDocument();
	});

});


