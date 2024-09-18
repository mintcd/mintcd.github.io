import './table.css'; // Add styles for sliding drawer here

export default function SlidingDrawer({
  isOpen,
  onClose,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`sliding-drawer ${isOpen ? 'open' : ''}`}>
      <div className="drawer-content">
        <button onClick={onClose} className="close-btn">X</button>
        {children}
      </div>
    </div>
  );
}
