import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import LaptopForm from "main/components/Laptops/LaptopForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function LaptopsEditPage() {
    let { id } = useParams();

    const { data: laptop, error, status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/laptops?id=${id}`],
            {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/laptops`,
                params: {
                    id
                }
            }
        );


<<<<<<< HEAD
    const objectToAxiosPutParams = (laptop) => ({
        url: "/api/laptops",
        method: "PUT",
        params: {
            id: laptop.id,
        },
        data: {
            name: laptop.name,
            cpu: laptop.cpu,
            gpu: laptop.gpu,
            description: laptop.description
        }
    });

    const onSuccess = (laptop) => {
        toast(`Laptop Updated - id: ${laptop.id} name: ${laptop.name}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/laptops?id=${id}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess) {
        return <Navigate to="/laptops/list" />
    }
=======
    const onSubmit = async (laptop) => {
        const updatedLaptop = laptopUtils.update(laptop);
        console.log("updatedLaptop: " + JSON.stringify(updatedLaptop));
        navigate("/laptops/list");
    }  
>>>>>>> 6f61b1d0b4bb39571bf8ea44378528b3691b4154

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Laptop</h1>
                {laptop &&
                    <LaptopForm initialLaptop={laptop} submitAction={onSubmit} buttonLabel="Update" />
                }
            </div>
        </BasicLayout>
    )
}

