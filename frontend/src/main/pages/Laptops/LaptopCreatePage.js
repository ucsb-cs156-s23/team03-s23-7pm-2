import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import LaptopForm from "main/components/Laptops/LaptopForm";
import { useNavigate } from 'react-router-dom'
import { laptopUtils } from 'main/utils/laptopUtils';

export default function LaptopCreatePage() {

  let navigate = useNavigate(); 

  const onSubmit = async (laptop) => {
    const createdLaptop = laptopUtils.add(laptop);
    console.log("createdLaptop: " + JSON.stringify(createdLaptop));
    navigate("/laptops");
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
