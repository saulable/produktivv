import React from 'react';
import classnames from 'classnames';

const TextFieldGroup = ({
	field,
	value,
	label,
	error,
	type,
	onChange,
	checkUserExists,
	placeholder
}) => {
	return (
		<div className={classnames('form-group row', { 'has-error': error })}>
			<label className="control-label"></label>
			<input
				onChange={onChange}
				onBlur={checkUserExists}
				value={value}
				type={type}
				name={field}
				className="form-control"
				placeholder={placeholder}
			/>
			{error && <span className="help-block">{error}</span>}
		</div>
	);
};


TextFieldGroup.defaultProps = {
	type: 'text'
};

export default TextFieldGroup;
