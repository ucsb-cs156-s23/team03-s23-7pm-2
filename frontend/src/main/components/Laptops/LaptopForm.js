import React from 'react'
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function LaptopForm({ initialLaptop, submitAction, buttonLabel = "Create" }) {

    const navigate = useNavigate();
    
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialLaptop || {}, }
    );
    // Stryker enable all
   
    const testIdPrefix = "LaptopForm";

	return (

		<Form onSubmit={handleSubmit(submitAction)}>

			{initialLaptop && (
				<Form.Group className="mb-3" >
					<Form.Label htmlFor="id">Id</Form.Label>
					<Form.Control
						data-testid={testIdPrefix + "-id"}
						id="id"
						type="text"
						{...register("id")}
						value={initialLaptop.id}
						disabled
					/>
				</Form.Group>
			)}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="name">Name</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-name"}
                    id="name"
                    type="text"
                    isInvalid={Boolean(errors.name)}
                    {...register("name", {
                        required: "Name is required.",
                        maxLength : {
                            value: 30,
                            message: "Max length 30 characters"
                        }
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="cpu">CPU</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-cpu"}
                    id="cpu"
                    type="text"
                    isInvalid={Boolean(errors.cpu)}
                    {...register("cpu", {
                        required: "CPU is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.cpu?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="gpu">GPU</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-gpu"}
                    id="gpu"
                    type="text"
                    isInvalid={Boolean(errors.gpu)}
                    {...register("gpu", {
                        required: "GPU is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.gpu?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="description">Description</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-description"}
                    id="description"
                    type="text"
                    isInvalid={Boolean(errors.description)}
                    {...register("description", {
                        required: "Description is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.description?.message}
                </Form.Control.Feedback>
            </Form.Group>


			<Button
				type="submit"
				data-testid={testIdPrefix + "-submit"}
			>
				{buttonLabel}
			</Button>
			<Button
				variant="Secondary"
				onClick={() => navigate(-1)}
				data-testid={testIdPrefix + "-cancel"}
			>
				Cancel
			</Button>

		</Form>

	)
}

export default LaptopForm;