import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useNavigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/schoolUtils";
import { hasRole } from "main/utils/currentUser";

export default function SchoolsTable({ schools, currentUser, showButtons=true }) {
	const navigate = useNavigate();

	const editCallback = (cell) => {
		navigate(`/schools/edit/${cell.row.values.id}`)
	}

	const detailsCallback = (cell) => {
		navigate(`/schools/details/${cell.row.values.id}`)
	}

	// Stryker disable all : hard to test for query caching

	const deleteMutation = useBackendMutation(
		cellToAxiosParamsDelete,
		{ onSuccess: onDeleteSuccess },
		["/api/schools/all"]
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
            Header: 'Rank',
            accessor: 'rank',
        },
        {
            Header: 'Description',
            accessor: 'description',
        }
    ];

    if (showButtons && hasRole(currentUser, "ROLE_ADMIN")) {
		columns.push(ButtonColumn("Details", "primary", detailsCallback, "SchoolTable"));
		columns.push(ButtonColumn("Edit", "primary", editCallback, "SchoolTable"));
		columns.push(ButtonColumn("Delete", "danger", deleteCallback, "SchoolTable"));
	}

    const memoizedColumns = React.useMemo(() => columns, [columns]);
	const memoizedSchools = React.useMemo(() => schools, [schools]);

    return <OurTable
        data={memoizedSchools}
        columns={memoizedColumns}
        testid={"SchoolTable"}
    />;
};

