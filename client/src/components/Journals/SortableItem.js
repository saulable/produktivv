import {
	SortableContainer,
	SortableElement,
	arrayMove
} from 'react-sortable-hoc';
import Item from './Item';

const SortableItem = SortableElement(Item);
export default SortableItem;
