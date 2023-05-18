import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/LaptopUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function LaptopsTable({ laptops, currentUser }) {

	const navigate = useNavigate();

	const editCallback = (cell) => {
		navigate(`/laptops/edit/${cell.row.values.id}`)
	}

	// Stryker disable all : hard to test for query caching

	const deleteMutation = useBackendMutation(
		cellToAxiosParamsDelete,
		{ onSuccess: onDeleteSuccess },
		["/api/laptops/all"]
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
			Header: 'CPU',
			accessor: 'cpu',
		},
		{
			Header: 'GPU',
			accessor: 'gpu',
		}
		,
		{
			Header: 'Description',
			accessor: 'description',
		}
	];

	if (hasRole(currentUser, "ROLE_ADMIN")) {
		columns.push(ButtonColumn("Edit", "primary", editCallback, "LaptopTable"));
		columns.push(ButtonColumn("Delete", "danger", deleteCallback, "LaptopTable"));
	}

	// Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
	const memoizedColumns = React.useMemo(() => columns, [columns]);
	const memoizedLaptops = React.useMemo(() => laptops, [laptops]);

	return <OurTable
		data={memoizedLaptops}
		columns={memoizedColumns}
		testid={"LaptopTable"}
	/>;
};