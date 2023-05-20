import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import LaptopTable from "main/components/Laptops/LaptopTable";
import { laptopUtils } from "main/utils/laptopUtils";

export default function LaptopDetailsPage({mockId, mockLaptop}) {
	let { id } = useParams();

	if (mockId !== undefined) {
		id = mockId;
	}

	let response = laptopUtils.getById(id);	
	if (mockLaptop !== undefined) {
		response = {laptop: mockLaptop}
	}

	return (
		<BasicLayout>
			<div className="pt-2">
				<h1>Laptop Details</h1>
				<LaptopTable laptops={[response.laptop]} showButtons={false} />
			</div>
		</BasicLayout>
	)
}
