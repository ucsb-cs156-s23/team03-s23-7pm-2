import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import LaptopForm from "main/components/Laptops/LaptopForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function LaptopsCreatePage() {

  const objectToAxiosParams = (laptop) => ({
    url: "/api/laptops/post",
    method: "POST",
    params: {
      name: laptop.name,
      cpu: laptop.cpu,
      gpu: laptop.gpu,
      description: laptop.description
    }
  });

  const onSuccess = (laptop) => {
    toast(`New laptop Created - id: ${laptop.id} name: ${laptop.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/laptops/all"]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/laptops/list" />
  }


  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Laptop</h1>

        <LaptopForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}