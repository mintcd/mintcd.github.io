import './table.css'; // Add styles for sliding drawer here
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

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
        <CloseFullscreenIcon
          style={{ transform: 'rotate(90deg)' }} // Updated rotation
          onClick={onClose}
          className="close-btn"
        />
        {children}
      </div>
    </div>
  );
}
