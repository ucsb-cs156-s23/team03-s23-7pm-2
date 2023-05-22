import { render, waitFor, fireEvent } from "@testing-library/react";
import RestaurantsCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
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

describe("RestaurantsCreatePage tests", () => {

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
                    <RestaurantsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const restaurant = {
            id: 17,
            name: "The Habit",
            address: "888 Embarcadero del Norte",
            city: "Isla Vista",
            state: "CA",
            zip: "93117",
            description: "Burgers and Fries"
        };

        axiosMock.onPost("/api/restaurants/post").reply(202, restaurant);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("RestaurantForm-name")).toBeInTheDocument();
        });

        const nameField = getByTestId("RestaurantForm-name");
        const addressField = getByTestId("RestaurantForm-address");
        const cityField = getByTestId("RestaurantForm-city");
        const stateField = getByTestId("RestaurantForm-state");
        const zipField = getByTestId("RestaurantForm-zip");
        const descriptionField = getByTestId("RestaurantForm-description");
        const submitButton = getByTestId("RestaurantForm-submit");

        fireEvent.change(nameField, { target: { value: 'The Habit' } });
        fireEvent.change(addressField, { target: { value: '888 Embarcadero del Norte' } });
        fireEvent.change(cityField, { target: { value: 'Isla Vista' } });
        fireEvent.change(stateField, { target: { value: 'CA' } });
        fireEvent.change(zipField, { target: { value: '93117' } });
        fireEvent.change(descriptionField, { target: { value: 'Burgers and Fries' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);


        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                name: "The Habit",
                address: "888 Embarcadero del Norte",
                city: "Isla Vista",
                state: "CA",
                zip: "93117",
                description: "Burgers and Fries"
            });

        expect(mockToast).toBeCalledWith("New restaurant Created - id: 17 name: The Habit");
        expect(mockNavigate).toBeCalledWith({ "to": "/restaurants/list" });
    });


});


