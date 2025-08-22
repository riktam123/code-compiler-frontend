import clsx from 'clsx';

function MyComponent({ isActive=true }) {
  return (
    <div className={clsx('base-class', { 'active-class': isActive, 'inactive-class': !isActive })}>
      Hello World
    </div>
  );
}
export default MyComponent;