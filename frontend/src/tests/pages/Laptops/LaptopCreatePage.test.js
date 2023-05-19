import { render, waitFor, fireEvent } from "@testing-library/react";
import LaptopsCreatePage from "main/pages/Laptops/LaptopCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("LaptopsCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LaptopsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const laptop = {
            id: 17,
            name: "OMEN 16t-k000",
            cpu: "Intel Core i5-12500H",
            gpu: "NVIDIA GeForce RTX 3050 Laptop",
            description: "Cheap but still fast"
        };

        axiosMock.onPost("/api/laptops/post").reply(202, laptop);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LaptopsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("LaptopForm-name")).toBeInTheDocument();
        });

        const nameField = getByTestId("LaptopForm-name");
        const cpuField = getByTestId("LaptopForm-cpu");
        const gpuField = getByTestId("LaptopForm-gpu");
        const descriptionField = getByTestId("LaptopForm-description");
        const submitButton = getByTestId("LaptopForm-submit");


        fireEvent.change(nameField, { target: { value: 'OMEN 16t-k000' } });
        fireEvent.change(cpuField, { target: { value: 'Intel Core i5-12500H' } });
        fireEvent.change(gpuField, { target: { value: 'NVIDIA GeForce RTX 3050 Laptop' } });
        fireEvent.change(descriptionField, { target: { value: 'Cheap but still fast' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "name": "OMEN 16t-k000",
                "cpu": "Intel Core i5-12500H",
                "gpu": "NVIDIA GeForce RTX 3050 Laptop",
                "description": "Cheap but still fast"
            });

        expect(mockToast).toBeCalledWith("New laptop Created - id: 17 name: OMEN 16t-k000");
        expect(mockNavigate).toBeCalledWith({ "to": "/laptops/list" });
    });


});


