import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import SchoolCreatePage from "main/pages/Schools/SchoolCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter"
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockAdd = jest.fn();
jest.mock('main/utils/schoolUtils', () => {
    return {
        __esModule: true,
        schoolUtils: {
            add: () => { return mockAdd(); }
        }
    }
});

describe("SchoolCreatePage tests", () => {
    const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    
    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("redirects to /schools on submit", async () => {

        const restoreConsole = mockConsole();

        mockAdd.mockReturnValue({
            "school": {
                id: 3,
                name: "San Diego University",
                rank: "34",
                description: "Public land-grant research university in La Jolla, California. It is ranked among the best universities in the world."
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();


        const rankInput = screen.getByLabelText("Rank");
        expect(rankInput).toBeInTheDocument();

        const descriptionInput = screen.getByLabelText("Description");
        expect(descriptionInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'San Diego University' } })
            fireEvent.change(rankInput, { target: { value: '34' } })
            fireEvent.change(descriptionInput, { target: { value: 'Public land-grant research university in La Jolla, California. It is ranked among the best universities in the world.' } })
            fireEvent.click(createButton);
        });

        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/schools"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `createdSchool: {"school":{"id":3,"name":"San Diego University","rank":"34","description":"Public land-grant research university in La Jolla, California. It is ranked among the best universities in the world."}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


