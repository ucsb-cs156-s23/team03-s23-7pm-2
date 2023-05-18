import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import LaptopCreatePage from "main/pages/Laptops/LaptopCreatePage";
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
    useNavigate: () => mockNavigate
}));

const mockAdd = jest.fn();
jest.mock('main/utils/laptopUtils', () => {
    return {
        __esModule: true,
        laptopUtils: {
            add: () => { return mockAdd(); }
        }
    }
});

describe("LaptopCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither); 

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LaptopCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("redirects to /laptops on submit", async () => {

        const restoreConsole = mockConsole();

        mockAdd.mockReturnValue({
            "laptop": laptopFixtures.oneLaptop
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LaptopCreatePage />
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

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        const otherLaptop = {...laptopFixtures.oneLaptop[0]}
        await act(async () => {
            fireEvent.change(nameInput, { target: { value: otherLaptop.name } })
            fireEvent.change(cpuInput, { target: { value: otherLaptop.cpu } })
            fireEvent.change(gpuInput, { target: { value: otherLaptop.gpu } })
            fireEvent.change(descriptionInput, { target: { value: otherLaptop.description } })
            fireEvent.click(createButton);
        });

        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/laptops"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `createdLaptop: {"laptop":${JSON.stringify(laptopFixtures.oneLaptop)}}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


