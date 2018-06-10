import React from 'react';
export default function CustomOverlay({ classNames, selectedDay, children, ...props }) {
  return (
    <div
      className={classNames.overlayWrapper}
      {...props}
    >
      <div className={classNames.overlay}>
        {children}
      </div>
    </div>
  );
}
