import { fireEvent, queryByTestId, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import SchoolsEditPage from "main/pages/Schools/SchoolEditPage";

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

describe("SchoolsEditPage tests", () => {

    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/schools", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const { getByText, queryByTestId, findByText } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <SchoolsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit School");
            expect(queryByTestId("SchoolForm-name")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/schools", { params: { id: 17 } }).reply(200, {
                id: 17,
                name: "UCSB",
                rank: "32",      
                description:"A public land-grand research university in Santa Barbara, California. It is the third-oldest UC."
            });
            axiosMock.onPut('/api/schools').reply(200, {
                id: 17,
                name: "UC Santa Barbara",
                rank: "31",      
                description:"It's a university probably."
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <SchoolsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <SchoolsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("SchoolForm-name");

            const idField = getByTestId("SchoolForm-id");
            const nameField = getByTestId("SchoolForm-name");
            const rankField = getByTestId("SchoolForm-rank");
            const descriptionField = getByTestId("SchoolForm-description")
            const submitButton = getByTestId("SchoolForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("UCSB");
            expect(rankField).toHaveValue("32");
            expect(descriptionField).toHaveValue("A public land-grand research university in Santa Barbara, California. It is the third-oldest UC.");
        });

        test("Changes when you click Update", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <SchoolsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("SchoolForm-name");

            const idField = getByTestId("SchoolForm-id");
            const nameField = getByTestId("SchoolForm-name");
            const rankField = getByTestId("SchoolForm-rank");
            const descriptionField = getByTestId("SchoolForm-description")
            const submitButton = getByTestId("SchoolForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("UCSB");
            expect(rankField).toHaveValue("32");
            expect(descriptionField).toHaveValue("A public land-grand research university in Santa Barbara, California. It is the third-oldest UC.");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: 'UC Santa Barbara' } })
            fireEvent.change(rankField, { target: { value: '31' } })
            fireEvent.change(descriptionField, { target: { value: 'It\'s a university probably.' } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("School Updated - id: 17 name: UC Santa Barbara");
            expect(mockNavigate).toBeCalledWith({ "to": "/schools/list" });


            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                name: "UC Santa Barbara",
                rank: "31",      
                description:"It's a university probably."
            })); // posted object

        });


    });
});


