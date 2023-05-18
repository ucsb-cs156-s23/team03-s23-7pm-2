import { render, screen } from "@testing-library/react";
import SchoolDetailsPage from "main/pages/Schools/SchoolDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

jest.mock('main/utils/schoolUtils', () => {
    return {
        __esModule: true,
        schoolUtils: {
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

describe("SchoolDetailsPage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields, and no buttons", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(screen.getByText("UCSD")).toBeInTheDocument();
        expect(screen.getByText("34")).toBeInTheDocument();
        expect(screen.getByText("Public land-grant research university in La Jolla, California. It is ranked among the best universities in the world.")).toBeInTheDocument();

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

});


