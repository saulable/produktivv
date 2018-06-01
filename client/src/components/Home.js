import React, {Component} from 'react';
import {render} from 'react-dom';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

const SortableItem = SortableElement( ( {value} ) =>
  <li>{value}</li>
);

const SortableList = SortableContainer(({items}) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </ul>
  );
});

class Home extends Component {
	constructor(props){
		super(props);
			this.state = {
		    items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
		  };
			this.onSortEnd = this.onSortEnd.bind(this);
	}
  onSortEnd({oldIndex, newIndex}) {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    });
		console.log(this.state);
  };
  render() {

    return <SortableList items={this.state.items} onSortEnd={this.onSortEnd} />;
  }
}

export default Home;
