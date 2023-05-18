import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import LaptopsTable from 'main/components/Laptops/LaptopTable';
import { useCurrentUser } from 'main/utils/currentUser'

export default function LaptopsIndexPage() {

  const currentUser = useCurrentUser();

  const { data: laptops, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/laptops/all"],
      { method: "GET", url: "/api/laptops/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Laptops</h1>
        <LaptopsTable laptops={laptops} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}