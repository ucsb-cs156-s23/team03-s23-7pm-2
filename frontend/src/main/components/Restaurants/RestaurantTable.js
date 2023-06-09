import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/restaurantUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function RestaurantsTable({ restaurants, currentUser, showButtons=true }) {
	const navigate = useNavigate();

	const editCallback = (cell) => {
		navigate(`/restaurants/edit/${cell.row.values.id}`)
	}

	const detailsCallback = (cell) => {
		navigate(`/restaurants/details/${cell.row.values.id}`)
	}

	// Stryker disable all : hard to test for query caching

	const deleteMutation = useBackendMutation(
		cellToAxiosParamsDelete,
		{ onSuccess: onDeleteSuccess },
		["/api/restaurants/all"]
	);
	// Stryker enable all 

	// Stryker disable next-line all : TODO try to make a good test for this
	const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


	const columns = [
		{
			Header: 'id',
			accessor: 'id', // accessor is the "key" in the data
		},
		{
			Header: 'Name',
			accessor: 'name',
		},
		{
			Header: 'Description',
			accessor: 'description',
		}
	];

	if (showButtons && hasRole(currentUser, "ROLE_ADMIN")) {
		columns.push(ButtonColumn("Details", "primary", detailsCallback, "RestaurantTable"));
		columns.push(ButtonColumn("Edit", "primary", editCallback, "RestaurantTable"));
		columns.push(ButtonColumn("Delete", "danger", deleteCallback, "RestaurantTable"));
	}

	// Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
	const memoizedColumns = React.useMemo(() => columns, [columns]);
	const memoizedRestaurants = React.useMemo(() => restaurants, [restaurants]);

	return <OurTable
		data={memoizedRestaurants}
		columns={memoizedColumns}
		testid={"RestaurantTable"}
	/>;
};