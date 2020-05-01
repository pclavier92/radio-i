import React from 'react';

import './styles.css';

const CustomCheckbox = ({ className, onChange }) => (
  <div className={className}>
    <label htmlFor="custom-checkbox" className="custom-checkbox-container">
      <input
        type="checkbox"
        onChange={onChange}
        name="custom-checkbox"
        id="custom-checkbox"
      />
      <span className="custom-checkmark">&nbsp;</span>
    </label>
  </div>
);

export default CustomCheckbox;
