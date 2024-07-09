import React from "react";

const Notification = ({successMessage, errorMessage}) => {
  if (!successMessage && !errorMessage) {
    return null;
  }

  const message = successMessage || errorMessage;
  const className = successMessage ? "success" : "error";

  return <div className={className}>{message}</div>;
};

export default Notification;
