import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import LaptopEditPage from "main/pages/Laptops/LaptopEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { laptopFixtures } from "fixtures/laptopFixtures";
import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 2
    }),
    useNavigate: () => mockNavigate
}));

const mockUpdate = jest.fn();
jest.mock('main/utils/laptopUtils', () => {
    return {
        __esModule: true,
        laptopUtils: {
            update: (_laptop) => {return mockUpdate();},
            getById: (_id) => {
                return {
                    laptop: {  // Couldn't use fixture because it's out-of-scope
                        "id": 2,
                        "name": "ASUS E210",
                        "cpu": "Intel Pentium N4020",
                        "gpu": "Integrated Intel UHD Graphics",
                        "description": "Extremely cheap and functional"  
                    },
                }
            }
        }
    }
});


describe("LaptopEditPage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither); 

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LaptopEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LaptopEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId("LaptopForm-name")).toBeInTheDocument();
        expect(screen.getByDisplayValue(laptopFixtures.threeLaptops[0].name)).toBeInTheDocument();
        expect(screen.getByDisplayValue(laptopFixtures.threeLaptops[0].description)).toBeInTheDocument();
    });

    test("redirects to /laptops on submit", async () => {

        const restoreConsole = mockConsole();
        const otherLaptop = {...laptopFixtures.threeLaptops[1], id:2}

        mockUpdate.mockReturnValue({
            "laptop": otherLaptop
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LaptopEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();

        const cpuInput = screen.getByLabelText("CPU");
        expect(cpuInput).toBeInTheDocument();

        const gpuInput = screen.getByLabelText("GPU");
        expect(gpuInput).toBeInTheDocument();

        const descriptionInput = screen.getByLabelText("Description");
        expect(descriptionInput).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: otherLaptop.name } })
            fireEvent.change(cpuInput, { target: { value: otherLaptop.cpu } })
            fireEvent.change(gpuInput, { target: { value: otherLaptop.gpu } })
            fireEvent.change(descriptionInput, { target: { value: otherLaptop.description } })
            fireEvent.click(updateButton);
        });

        await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/laptops/list"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `updatedLaptop: {"laptop":${JSON.stringify(otherLaptop)}}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


