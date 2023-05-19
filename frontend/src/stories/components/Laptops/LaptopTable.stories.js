import React from 'react';
import LaptopTable from 'main/components/Laptops/LaptopTable';
import { laptopFixtures } from 'fixtures/laptopFixtures';

export default {
	title: 'components/Laptops/LaptopsTable',
	component: LaptopTable
};

const Template = (args) => {
	return (
		<LaptopTable {...args} />
	)
};

export const Empty = Template.bind({});

Empty.args = {
	laptops: []
};

export const ThreeSubjectsNoButtons = Template.bind({});

ThreeSubjectsNoButtons.args = {
	laptops: laptopFixtures.threeLaptops,
	showButtons: false
};

export const ThreeSubjectsWithButtons = Template.bind({});
ThreeSubjectsWithButtons.args = {
	laptops: laptopFixtures.threeLaptops,
	showButtons: true
};
