import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

import TodosIndexPage from "main/pages/Todos/TodosIndexPage";
import TodosCreatePage from "main/pages/Todos/TodosCreatePage";
import TodosEditPage from "main/pages/Todos/TodosEditPage";

import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";

import LaptopIndexPage from "main/pages/Laptops/LaptopIndexPage";
import LaptopEditPage from "main/pages/Laptops/LaptopEditPage";
import LaptopDetailsPage from "main/pages/Laptops/LaptopDetailsPage";
import LaptopCreatePage from "main/pages/Laptops/LaptopCreatePage";

import SchoolCreatePage from "main/pages/Schools/SchoolCreatePage";
import SchoolEditPage from "main/pages/Schools/SchoolEditPage";
import SchoolIndexPage from "main/pages/Schools/SchoolIndexPage";
import SchoolDetailsPage from "main/pages/Schools/SchoolDetailsPage";

import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";


function App() {

  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfilePage />} />
        <Route exact path="/schools/details/:id" element={<SchoolDetailsPage />} />
        {
          hasRole(currentUser, "ROLE_ADMIN") && <Route exact path="/admin/users" element={<AdminUsersPage />} />
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/todos/list" element={<TodosIndexPage />} />
              <Route exact path="/todos/create" element={<TodosCreatePage />} />
              <Route exact path="/todos/edit/:todoId" element={<TodosEditPage />} />
            </>
          )
        }

        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/ucsbdates/list" element={<UCSBDatesIndexPage />} />
              <Route exact path="/schools/list" element={<SchoolIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/ucsbdates/edit/:id" element={<UCSBDatesEditPage />} />
              <Route exact path="/ucsbdates/create" element={<UCSBDatesCreatePage />} />
              <Route exact path="/schools/create" element={<SchoolCreatePage />} />
              <Route exact path="/schools/edit/:id" element={<SchoolEditPage />} />
            </>
          )
        }

        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/laptops/list" element={<LaptopIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/laptops/edit/:id" element={<LaptopEditPage />} />
              <Route exact path="/laptops/details/:id" element={<LaptopDetailsPage />} />
              <Route exact path="/laptops/create" element={<LaptopCreatePage />} />
            </>
          )
        }

        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/laptops/list" element={<LaptopIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/laptops/edit/:id" element={<LaptopEditPage />} />
              <Route exact path="/laptops/details/:id" element={<LaptopDetailsPage />} />
              <Route exact path="/laptops/create" element={<LaptopCreatePage />} />
            </>
          )
        }

      </Routes>
    </BrowserRouter>
  );
}

export default App;
