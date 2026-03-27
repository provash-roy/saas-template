import React from "react";
import clsx from "clsx"; 

interface ChildrenProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: ChildrenProps) => {
  return <div className={clsx("max-h-7xl px-4", className)}>{children}</div>;
};

export default Container;
