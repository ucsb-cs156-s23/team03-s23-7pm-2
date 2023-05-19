import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import LaptopTable from "main/components/Laptops/LaptopTable";
import { useBackend } from 'main/utils/useBackend';

export default function LaptopDetailsPage() {
	let { id } = useParams();

	const { data: laptops, error: _error, status: _status } =
		useBackend(
			// Stryker disable next-line all : don't test internal caching of React Query
			["/api/laptops/all"],
			{ method: "GET", url: "/api/laptops/all" },
			[]
		);

	return (
		<BasicLayout>
			<div className="pt-2">
				<h1>Laptop Details</h1>
				<LaptopTable laptops={laptops} showButtons={true} />
			</div>
		</BasicLayout>
	)
}
