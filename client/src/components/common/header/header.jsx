import PropTypes from 'prop-types';
import { IconName, IconSize, ButtonType, AppRoute } from 'common/enums/enums';
import { DEFAULT_USER_AVATAR } from 'common/constants/constants';
import { userType } from 'common/prop-types/prop-types';
import { IconButton, Button, Icon, Image, NavLink } from 'components/common/common';

import { useDispatch, useCallback, useState } from 'hooks/hooks';
import { threadActionCreator } from 'store/actions';

import styles from './styles.module.scss';

const Header = ({ user, onUserLogout }) => {
  const dispatch = useDispatch();

  const [edit, setEdit] = useState(false);
  const [_status, setStatus] = useState(user.status);

  const handleClick = useCallback(() => {
    dispatch(threadActionCreator.updateUserStatus({ id: user.id, status: _status }));
  }, [_status, dispatch]);

  return (
    <div className={styles.headerWrp}>
      {user && (
        <>
          <NavLink to={AppRoute.ROOT}>
            <div className={styles.userWrapper}>
              <Image
                isCircular
                width="45"
                height="45"
                src={user.image?.link ?? DEFAULT_USER_AVATAR}
                alt="user avatar"
              />
              {' '}
              {user.username}
              <br />
              {user.status}
            </div>
          </NavLink>
          <span>
            <IconButton
              iconName={IconName.UPDATE}
              onClick={() => setEdit(!edit)}
            />
            {edit ? (
              <>
                <input type="text" value={_status} onChange={event => setStatus(event.target.value)} />
                <button type="button" onClick={handleClick}>OK</button>
              </>
            ) : null}
          </span>
        </>
      )}
      <div>
        <NavLink to={AppRoute.PROFILE} className={styles.menuBtn}>
          <Icon name={IconName.USER_CIRCLE} size={IconSize.LARGE} />
        </NavLink>
        <Button
          className={`${styles.menuBtn} ${styles.logoutBtn}`}
          onClick={onUserLogout}
          type={ButtonType.BUTTON}
          iconName={IconName.LOG_OUT}
          iconSize={IconSize.LARGE}
          isBasic
        />
      </div>
    </div>
  );
};

Header.propTypes = {
  onUserLogout: PropTypes.func.isRequired,
  user: userType.isRequired
};

export { Header };
