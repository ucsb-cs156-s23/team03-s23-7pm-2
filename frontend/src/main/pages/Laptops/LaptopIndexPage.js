import React from 'react'
import Button from 'react-bootstrap/Button';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import LaptopTable from 'main/components/Laptops/LaptopTable';
import { laptopUtils } from 'main/utils/laptopUtils';
import { useNavigate, Link } from 'react-router-dom';

export default function LaptopIndexPage() {

	const navigate = useNavigate();

	const laptopCollection = laptopUtils.get();
	const laptops = laptopCollection.laptops;

	const showCell = (cell) => JSON.stringify(cell.row.values);

	const deleteCallback = async (cell) => {
		console.log(`LaptopIndexPage deleteCallback: ${showCell(cell)})`);
		laptopUtils.del(cell.row.values.id);
		navigate("/laptops");
	}

	return (
		<BasicLayout>
			<div className="pt-2">
				<Button style={{ float: "right" }} as={Link} to="/laptops/create">
					Create Laptop
				</Button>
				<h1>Laptops</h1>
				<LaptopTable laptops={laptops} deleteCallback={deleteCallback} />
			</div>
		</BasicLayout>
	)
}