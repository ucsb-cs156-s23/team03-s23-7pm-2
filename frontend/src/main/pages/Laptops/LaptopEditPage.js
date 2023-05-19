
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import { laptopUtils }  from 'main/utils/laptopUtils';
import LaptopForm from 'main/components/Laptops/LaptopForm';
import { useNavigate } from 'react-router-dom'


export default function LaptopEditPage() {
    let { id } = useParams();

    let navigate = useNavigate(); 

    const response = laptopUtils.getById(id);

    const onSubmit = async (laptop) => {
        const updatedLaptop = laptopUtils.update(laptop);
        console.log("updatedLaptop: " + JSON.stringify(updatedLaptop));
        navigate("/laptops/list");
    }  

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Laptop</h1>
                <LaptopForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={response.laptop}/>
            </div>
        </BasicLayout>
    )
}