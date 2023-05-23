import { render, waitFor, fireEvent } from "@testing-library/react";
import SchoolsCreatePage from "main/pages/Schools/SchoolCreatePage";
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

describe("SchoolsCreatePage tests", () => {

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
                    <SchoolsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const school = {
            "id": 17,
            "name": "UCSB",
            "rank": "32",      
            "description":"A public land-grand research university in Santa Barbara, California. It is the third-oldest UC."
        };

        axiosMock.onPost("/api/schools/post").reply(202, school);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("SchoolForm-name")).toBeInTheDocument();
        });

        const nameField = getByTestId("SchoolForm-name");
        const rankField = getByTestId("SchoolForm-rank");
        const descriptionField = getByTestId("SchoolForm-description");
        const submitButton = getByTestId("SchoolForm-submit");

        fireEvent.change(nameField, { target: { value: 'UC Santa Barbara' } });
        fireEvent.change(rankField, { target: { value: '31' } });
        fireEvent.change(descriptionField, { target: { value: 'It\'s a university probably.' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);


        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "name": "UC Santa Barbara",
                "rank": "31",      
                "description":"It's a university probably."
            });

        expect(mockToast).toBeCalledWith("New school Created - id: 17 name: UCSB");
        expect(mockNavigate).toBeCalledWith({ "to": "/schools/list" });
    });


});


