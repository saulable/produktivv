import React, { Component } from 'react';
import { connect } from 'react-redux';
import LeftNavigation from '../../containers/LeftNavigation';
import ReactDOM from 'react-dom';
import Tooltip from 'rc-tooltip';
import './rc-tree/assets/index.css';
import './contextmenu.less';
import Tree, { TreeNode } from './rc-tree';
import { gData } from './util';
import * as actions from '../../actions/trackActions';
// import 'rc-tree/assets/index.css';

class TracksDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gData,
			tree: [],
			autoExpandParent: true
			// expandedKeys: ['0-0-key', '0-0-0-key', '0-0-0-0-key']
		};
		this.onRightClick = this.onRightClick.bind(this);
	}
	componentDidMount = () => {
		this.props.treeView();
	};
	onDragStart = info => {
		console.log('start', info);
	};
	onDragEnter = info => {
		console.log('enter', info);
		this.setState({
			expandedKeys: info.expandedKeys
		});
	};
	onDrop = info => {
		console.log('drop', info);
		const dropKey = info.node.props.eventKey;
		const dragKey = info.dragNode.props.eventKey;
		const dropPos = info.node.props.pos.split('-');
		const dropPosition =
			info.dropPosition - Number(dropPos[dropPos.length - 1]);
		console.log(dropPosition);
		// const dragNodesKeys = info.dragNodesKeys;
		const loop = (data, key, callback) => {
			data.forEach((item, index, arr) => {
				if (item.key === key) {
					callback(item, index, arr);
					return;
				}
				if (item.children) {
					loop(item.children, key, callback);
				}
			});
		};
		const data = [...this.props.tracks.tree];
		let dragObj;
		loop(data, dragKey, (item, index, arr) => {
			arr.splice(index, 1);
			dragObj = item;
		});
		if (info.dropToGap) {
			let ar;
			let i;
			loop(data, dropKey, (item, index, arr) => {
				ar = arr;
				i = index;
			});
			if (dropPosition === -1) {
				ar.splice(i, 0, dragObj);
			} else {
				ar.splice(i + 1, 0, dragObj);
			}
		} else {
			loop(data, dropKey, item => {
				item.children = item.children || [];
				// where to insert 示例添加到尾部，可以是随意位置
				item.children.push(dragObj);
			});
		}
		this.props.updateTree(data);
	};
	onExpand = expandedKeys => {
		// console.log('onExpand', arguments);
		this.setState({
			expandedKeys,
			autoExpandParent: false
		});
	};
	onRightClick = info => {
		console.log('right click', info);
		this.setState({ selectedKeys: [info.node.props.eventKey] });
		this.renderCm(info);
	};
	getContainer() {
		if (!this.cmContainer) {
			this.cmContainer = document.createElement('div');
			document.body.appendChild(this.cmContainer);
		}
		return this.cmContainer;
	}
	renderCm(info) {
		if (this.toolTip) {
			ReactDOM.unmountComponentAtNode(this.cmContainer);
			this.toolTip = null;
		}
		this.toolTip = (
			<Tooltip
				trigger="click"
				placement="bottomRight"
				prefixCls="rc-tree-contextmenu"
				defaultVisible
				overlay={<h4>{info.node.props.title}</h4>}>
				<span />
			</Tooltip>
		);

		const container = this.getContainer();
		Object.assign(this.cmContainer.style, {
			position: 'absolute',
			left: `${info.event.pageX}px`,
			top: `${info.event.pageY}px`
		});

		ReactDOM.render(this.toolTip, container);
	}
	render() {
		// console.log(gData);
		// console.log(this.props.tracks.tree);
		const loop = data => {
			return data.map(item => {
				if (item.children && item.children.length) {
					return (
						<TreeNode key={item.key} title={item.title}>
							{loop(item.children)}
						</TreeNode>
					);
				}
				if (item.title === 'Inbox') {
					return (
						<TreeNode
							key={item.key}
							title={item.title}
							draggable={false}
							icon={<span className="rc-tree-iconEle rc-tree-icon__close" />}
						/>
					);
				} else if (item.title === 'Business' || item.title === 'Personal') {
					return (
						<TreeNode
							key={item.key}
							title={item.title}
							icon={<span className="rc-tree-iconEle rc-tree-icon__close" />}
						/>
					);
				} else {
					return <TreeNode key={item.key} title={item.title} />;
				}
			});
		};
		return (
			<div className="container">
				<LeftNavigation />
				<div className="content-x no-padding">
					<div className="treeView">
						<div className="draggable-demo">
							<div className="draggable-container">
								<Tree
									showLine={true}
									expandedKeys={this.state.expandedKeys}
									onExpand={this.onExpand}
									autoExpandParent={this.state.autoExpandParent}
									draggable
									onRightClick={this.onRightClick}
									onDragStart={this.onDragStart}
									onDragEnter={this.onDragEnter}
									onDrop={this.onDrop}>
									{loop(this.props.tracks.tree)}
								</Tree>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps({ tracks }) {
	return { tracks };
}

export default connect(
	mapStateToProps,
	actions
)(TracksDashboard);
