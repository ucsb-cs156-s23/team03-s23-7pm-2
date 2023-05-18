import React from 'react';
import LaptopForm from "main/components/Laptops/LaptopForm"
import { laptopFixtures } from 'fixtures/laptopFixtures';

export default {
    title: 'components/Laptops/LaptopForm',
    component: LaptopForm
};

const Template = (args) => {
    return (
        <LaptopForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    Laptop: laptopFixtures.oneLaptop,
    submitText: "",
    submitAction: () => { }
};