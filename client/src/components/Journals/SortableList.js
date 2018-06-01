import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import React, { Component } from 'react';
import SortableItem from './SortableItem';


const SortableList = SortableContainer(({ items }) => {
	return (
		<ul className="list-group list-group-flush">
			{items.map((value, index) => (
				<SortableItem
					key={`item-${index}`}
					index={index}
					value={value}
				/>
			))}
		</ul>
	);
});

export default SortableList;
