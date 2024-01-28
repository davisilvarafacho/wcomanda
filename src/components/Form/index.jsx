import { Children } from 'react';

export function Form(props) {
  const childrenWithProps = Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { sayHello });
    }
    return child;
  });
  return <div>{props.children}</div>;
}
