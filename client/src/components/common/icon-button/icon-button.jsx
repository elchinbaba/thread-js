import PropTypes from 'prop-types';

import { IconName } from 'common/enums/enums.js';
import { Icon } from 'components/common/common.js';

import styles from './styles.module.scss';

const IconButton = ({
  iconName,
  label,
  onClick,
  onHover,
  onNotHover
}) => (
  <button
    className={styles.iconButton}
    type="button"
    onClick={onClick}
    onMouseOver={onHover}
    onFocus={onHover}
    onMouseOut={onNotHover}
    onBlur={onNotHover}
  >
    <Icon name={iconName} />
    {label}
  </button>
);

IconButton.propTypes = {
  iconName: PropTypes.oneOf(Object.values(IconName)).isRequired,
  label: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onClick: PropTypes.func.isRequired,
  onHover: PropTypes.func,
  onNotHover: PropTypes.func
};

IconButton.defaultProps = {
  label: '',
  onHover: () => {},
  onNotHover: () => {}
};

export { IconButton };
