import React from 'react';

interface IStyledTextProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const StyledText: React.FC<IStyledTextProps> = ({
  children,
  className = '',
  as: Component = 'span'
}) => {
  return (
    <Component className={className}>
      {children}
    </Component>
  );
};

export default StyledText; 