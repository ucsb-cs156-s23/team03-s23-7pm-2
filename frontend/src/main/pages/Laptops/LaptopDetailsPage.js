import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import LaptopTable from "main/components/Laptops/LaptopTable";
import { laptopUtils } from "main/utils/laptopUtils";

export default function LaptopDetailsPage() {
	let { id } = useParams();

	const response = laptopUtils.getById(id);

	return (
		<BasicLayout>
			<div className="pt-2">
				<h1>Laptop Details</h1>
				<LaptopTable laptops={[response.laptop]} showButtons={false} />
			</div>
		</BasicLayout>
	)
}
