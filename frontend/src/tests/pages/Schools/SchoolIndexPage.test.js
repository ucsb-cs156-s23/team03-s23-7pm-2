import { render, screen, waitFor } from "@testing-library/react";
import SchoolIndexPage from "main/pages/Schools/SchoolIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockDelete = jest.fn();
jest.mock('main/utils/schoolUtils', () => {
    return {
        __esModule: true,
        schoolUtils: {
            del: (id) => {
                return mockDelete(id);
            },
            get: () => {
                return {
                    nextId: 5,
                    schools: [
                        {
                            id: 3,
                            name: "UCSD",
                            address: "9500 Gilman Dr",
                            city: "La Jolla",
                            state: "CA",
                            zip: "92093",
                            rank: "34",
                            description: "Public land-grant research university in La Jolla, California. It is ranked among the best universities in the world."
                        },
                    ]
                }
            }
        }
    }
});


describe("SchoolIndexPage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders correct fields", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const createSchoolButton = screen.getByText("Create School");
        expect(createSchoolButton).toBeInTheDocument();
        expect(createSchoolButton).toHaveAttribute("style", "float: right;");

        const name = screen.getByText("UCSD");
        expect(name).toBeInTheDocument();

        const rank = screen.getByText("34");
        expect(rank).toBeInTheDocument();

        const description = screen.getByText("Public land-grant research university in La Jolla, California. It is ranked among the best universities in the world.");
        expect(description).toBeInTheDocument();

        expect(screen.getByTestId("SchoolTable-cell-row-0-col-Delete-button")).toBeInTheDocument();
        expect(screen.getByTestId("SchoolTable-cell-row-0-col-Details-button")).toBeInTheDocument();
        expect(screen.getByTestId("SchoolTable-cell-row-0-col-Edit-button")).toBeInTheDocument();
    });

    test("delete button calls delete and reloads page", async () => {

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const name = screen.getByText("UCSD");
        expect(name).toBeInTheDocument();

        const rank = screen.getByText("34");
        expect(rank).toBeInTheDocument();

        const description = screen.getByText("Public land-grant research university in La Jolla, California. It is ranked among the best universities in the world.");
        expect(description).toBeInTheDocument();

        const deleteButton = screen.getByTestId("SchoolTable-cell-row-0-col-Delete-button");
        expect(deleteButton).toBeInTheDocument();

        deleteButton.click();

        expect(mockDelete).toHaveBeenCalledTimes(1);
        expect(mockDelete).toHaveBeenCalledWith(3);

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/schools"));


        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `SchoolIndexPage deleteCallback: {"id":3,"name":"UCSD","rank":"34","description":"Public land-grant research university in La Jolla, California. It is ranked among the best universities in the world."}`;
        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


