import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import SchoolEditPage from "main/pages/Schools/SchoolEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

const mockUpdate = jest.fn();
jest.mock('main/utils/schoolUtils', () => {
    return {
        __esModule: true,
        schoolUtils: {
            update: (_school) => {return mockUpdate();},
            getById: (_id) => {
                return {
                    school: {
                        id: 3,
                        name: "UCSD",
                        rank: "34",
                        description: "Public land-grant research university in La Jolla, California. It is ranked among the best universities in the world."
                    }
                }
            }
        }
    }
});


describe("SchoolEditPage tests", () => {

    const queryClient = new QueryClient();

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolEditPage/>
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId("SchoolForm-name")).toBeInTheDocument();
        expect(screen.getByDisplayValue("UCSD")).toBeInTheDocument();
        expect(screen.getByDisplayValue("34")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Public land-grant research university in La Jolla, California. It is ranked among the best universities in the world.")).toBeInTheDocument();
        
    });

    test("redirects to /schools on submit", async () => {

        const restoreConsole = mockConsole();

        mockUpdate.mockReturnValue({
            "school": {
                id: 3,
                name: "UCSD",
                rank: "34",
                description: "Public land-grant research university in La Jolla, California. It is ranked among the best universities in the world."
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();


        const rankInput = screen.getByLabelText("Rank");
        expect(rankInput).toBeInTheDocument();

        const descriptionInput = screen.getByLabelText("Description");
        expect(descriptionInput).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'UCSD' } })
            fireEvent.change(rankInput, { target: { value: '34' } })
            fireEvent.change(rankInput, { target: { value: 'Public land-grant research university in La Jolla, California. It is ranked among the best universities in the world.' } })
            fireEvent.click(updateButton);
        });

        await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/schools"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `updatedSchool: {"school":{"id":3,"name":"UCSD","rank":"34","description":"Public land-grant research university in La Jolla, California. It is ranked among the best universities in the world."}` 

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


