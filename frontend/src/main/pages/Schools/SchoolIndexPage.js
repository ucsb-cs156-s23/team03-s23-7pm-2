import React from 'react'
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import SchoolTable from 'main/components/Schools/SchoolTable';
import { useCurrentUser } from 'main/utils/currentUser'
import { useBackend } from 'main/utils/useBackend';

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
                    <SchoolTable schools={schools} currentUser={currentUser} />
                </div>
            </BasicLayout>
        )
}