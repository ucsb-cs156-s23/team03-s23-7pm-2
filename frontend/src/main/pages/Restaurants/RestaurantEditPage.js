import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RestaurantForm from "main/components/Restaurants/RestaurantForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RestaurantsEditPage() {
    let { id } = useParams();

    const { data: restauant, error, status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/restauants?id=${id}`],
            {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/restauants`,
                params: {
                    id
                }
            }
        );

    const objectToAxiosPutParams = (restauant) => ({
        url: "/api/restauants",
        method: "PUT",
        params: {
            id: restauant.id,
        },
        data: {
            name: restaurant.name,
            address: restaurant.address,
            city: restaurant.city,
            state: restaurant.state,
            zip: restaurant.zip,
            description: restaurant.description
        }
    });

    const onSuccess = (restauant) => {
        toast(`Restaurant Updated - id: ${restauant.id} name: ${restauant.name}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/restauants?id=${id}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess) {
        return <Navigate to="/restauants/list" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Restaurant</h1>
                {restauant &&
                    <RestaurantForm initialRestaurant={restauant} submitAction={onSubmit} buttonLabel="Update" />
                }
            </div>
        </BasicLayout>
    )
}

