import { fireEvent, queryByTestId, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import LaptopsEditPage from "main/pages/Laptops/LaptopEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
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

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("LaptopsEditPage tests", () => {

    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/laptops", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const { getByText, queryByTestId, findByText } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <LaptopsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit Laptop");
            expect(queryByTestId("LaptopForm-name")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/laptops", { params: { id: 17 } }).reply(200, {
                id: 17,
                name: "OMEN 16t-k000",
                cpu: "Intel Core i5-12500H",
                gpu: "NVIDIA GeForce RTX 3050 Laptop",
                description: "Cheap but still fast"
            });
            axiosMock.onPut('/api/laptops').reply(200, {
                id: "17",
                name: "ASUS E210",
                cpu: "Intel Pentium N4020",
                gpu: "Integrated Intel UHD Graphics",
                description: "Extremely cheap and functional"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <LaptopsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <LaptopsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("LaptopForm-name");

            const idField = getByTestId("LaptopForm-id");
            const nameField = getByTestId("LaptopForm-name");
            const cpuField = getByTestId("LaptopForm-cpu");
            const gpuField = getByTestId("LaptopForm-gpu");
            const descriptionField = getByTestId("LaptopForm-description")
            const submitButton = getByTestId("LaptopForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("OMEN 16t-k000");
            expect(cpuField).toHaveValue("Intel Core i5-12500H");
            expect(gpuField).toHaveValue("NVIDIA GeForce RTX 3050 Laptop");
            expect(descriptionField).toHaveValue("Cheap but still fast");
        });

        test("Changes when you click Update", async () => {



            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <LaptopsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("LaptopForm-name");

            const idField = getByTestId("LaptopForm-id");
            const nameField = getByTestId("LaptopForm-name");
            const cpuField = getByTestId("LaptopForm-cpu");
            const gpuField = getByTestId("LaptopForm-gpu");
            const descriptionField = getByTestId("LaptopForm-description")
            const submitButton = getByTestId("LaptopForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("OMEN 16t-k000");
            expect(cpuField).toHaveValue("Intel Core i5-12500H");
            expect(gpuField).toHaveValue("NVIDIA GeForce RTX 3050 Laptop");
            expect(descriptionField).toHaveValue("Cheap but still fast");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: 'ASUS E210' } })
            fireEvent.change(cpuField, { target: { value: 'Intel Pentium N4020' } })
            fireEvent.change(gpuField, { target: { value: 'Integrated Intel UHD Graphics' } })
            fireEvent.change(descriptionField, { target: { value: 'Extremely cheap and functional' } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("Laptop Updated - id: 17 name: ASUS E210");
            expect(mockNavigate).toBeCalledWith({ "to": "/laptops/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                name: "ASUS E210",
                cpu: "Intel Pentium N4020",
                gpu: "Integrated Intel UHD Graphics",
                description: "Extremely cheap and functional"
            })); // posted object

        });


    });

});


