
import React from 'react';

import LaptopDetailsPage from "main/pages/Laptops/LaptopDetailsPage";
import { laptopFixtures } from 'fixtures/laptopFixtures';

export default {
    title: 'pages/Laptops/LaptopDetailsPage',
    component: LaptopDetailsPage
};

const Template = () =>
    <LaptopDetailsPage mockId={2} mockLaptop={laptopFixtures.oneLaptop[0]} />;

export const Default = Template.bind({});




