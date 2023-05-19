import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import LaptopsTable from 'main/components/Laptops/LaptopTable';
import { useCurrentUser } from 'main/utils/currentUser'

export default function LaptopsIndexPage() {

	const currentUser = useCurrentUser();

<<<<<<< HEAD
	const { data: laptops, error: _error, status: _status } =
		useBackend(
			// Stryker disable next-line all : don't test internal caching of React Query
			["/api/laptops/all"],
			{ method: "GET", url: "/api/laptops/all" },
			[]
		);
=======
	const laptopCollection = laptopUtils.get();
	const laptops = laptopCollection.laptops;

	const showCell = (cell) => JSON.stringify(cell.row.values);

	const deleteCallback = async (cell) => {
		console.log(`LaptopIndexPage deleteCallback: ${showCell(cell)})`);
		laptopUtils.del(cell.row.values.id);
		navigate("/laptops/list");
	}
>>>>>>> 6f61b1d0b4bb39571bf8ea44378528b3691b4154

	return (
		<BasicLayout>
			<div className="pt-2">
				<h1>Laptops</h1>
				<LaptopsTable laptops={laptops} currentUser={currentUser} />
			</div>
		</BasicLayout>
	)
}