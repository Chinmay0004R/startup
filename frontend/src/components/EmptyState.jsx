/**
 * Empty State Component
 * Professional empty state messages with icons
 */

import { FaFolderOpen, FaSearch, FaBell, FaHeartBroken } from 'react-icons/fa';

const EmptyState = ({
  type = 'default',
  title = 'No data available',
  description = 'There\'s nothing to display right now.',
  icon = null,
  action = null,
}) => {
  const iconMap = {
    default: FaFolderOpen,
    search: FaSearch,
    notifications: FaBell,
    error: FaHeartBroken,
  };

  const IconComponent = icon || iconMap[type] || FaFolderOpen;

  return (
    <div className="empty-state-card">
      <div className="empty-state-icon">
        <IconComponent />
      </div>

      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>

      {action && (
        <button type="button" className="button button-primary empty-state-action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
