import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import LaptopForm from "main/components/Laptops/LaptopForm";
import { laptopFixtures } from "fixtures/laptopFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockedNavigate
}));

describe("LaptopForm tests", () => {
	const queryClient = new QueryClient();

	const expectedHeaders = ["Name", "CPU", "GPU", "Description"];
	const testId = "LaptopForm";

	test("renders correctly with no initialContents", async () => {
		render(
			<QueryClientProvider client={queryClient}>
				<Router>
					<LaptopForm />
				</Router>
			</QueryClientProvider>
		);

		expect(await screen.findByText(/Create/)).toBeInTheDocument();

		expectedHeaders.forEach((headerText) => {
			const header = screen.getByText(headerText);
			expect(header).toBeInTheDocument();
		});

	});

	test("renders correctly when passing in initialContents", async () => {
		render(
			<QueryClientProvider client={queryClient}>
				<Router>
					<LaptopForm initialContents={laptopFixtures.oneLaptop} />
				</Router>
			</QueryClientProvider>
		);

		expect(await screen.findByText(/Create/)).toBeInTheDocument();

		expectedHeaders.forEach((headerText) => {
			const header = screen.getByText(headerText);
			expect(header).toBeInTheDocument();
		});

		expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
		expect(screen.getByText(`Id`)).toBeInTheDocument();
	});


	test("that navigate(-1) is called when Cancel is clicked", async () => {
		render(
			<QueryClientProvider client={queryClient}>
				<Router>
					<LaptopForm />
				</Router>
			</QueryClientProvider>
		);
		expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
		const cancelButton = screen.getByTestId(`${testId}-cancel`);

		fireEvent.click(cancelButton);

		await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
	});

}); 