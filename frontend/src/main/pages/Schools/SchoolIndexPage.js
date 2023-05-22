import React from 'react'
import Button from 'react-bootstrap/Button';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import SchoolTable from 'main/components/Schools/SchoolTable';
import { schoolUtils } from 'main/utils/schoolUtils';
import { useNavigate, Link } from 'react-router-dom';
import { useCurrentUser } from 'main/utils/currentUser'
export default function SchoolIndexPage() {
    const currentUser = useCurrentUser();

	const { data: schools, error: _error, status: _status } =
		useBackend(
			// Stryker disable next-line all : don't test internal caching of React Query
			["/api/schools/all"],
			{ method: "GET", url: "/api/schools/all" },
			[]
		);

        return (
            <BasicLayout>
                <div className="pt-2">
                    <h1>Schools</h1>
                    <schoolsTable schools={Schools} currentUser={currentUser} />
                </div>
            </BasicLayout>
        )
}