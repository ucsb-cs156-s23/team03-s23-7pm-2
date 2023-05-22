import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import LaptopTable from "main/components/Laptops/LaptopTable";
import { useBackend } from 'main/utils/useBackend';
import { useCurrentUser } from 'main/utils/currentUser'

export default function LaptopDetailsPage() {
	let { id } = useParams();
	const currentUser = useCurrentUser();

	const { data: laptop, error, status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/laptops?id=${id}`],
            {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/laptops`,
                params: {
                    id
                }
            }
        );

	return (
		<BasicLayout>
			<div className="pt-2">
				<h1>Laptop Details</h1>
				<LaptopTable laptops={[laptop || {}]} currentUser={currentUser} showButtons={false} />
			</div>
		</BasicLayout>
	)
}
