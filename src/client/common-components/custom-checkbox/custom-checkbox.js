import React from 'react';

import './styles.css';

const CustomCheckbox = ({ className, id, onChange }) => (
  <div className={className}>
    <label htmlFor={id} className="custom-checkbox-container">
      <input type="checkbox" onChange={onChange} name={id} id={id} />
      <span className="custom-checkmark">&nbsp;</span>
    </label>
  </div>
);

export default CustomCheckbox;
