import { useCallback, useDispatch, useState } from 'hooks/hooks';

import PropTypes from 'prop-types';

import { threadActionCreator } from 'store/actions';

const UpdateProfile = ({ id, username, status }) => {
  const dispatch = useDispatch();

  const [_username, setUsername] = useState(username);
  const [_status, setStatus] = useState(status);

  const handleClick = useCallback(() => {
    dispatch(threadActionCreator.updateUser({ id, username: _username, status: _status }));
  }, [_username, _status, dispatch]);

  return (
    <>
      <input type="text" value={_username} onChange={event => setUsername(event.target.value)} />
      <input type="text" value={_status} onChange={event => setStatus(event.target.value)} />
      <button type="button" onClick={handleClick}>OK</button>
    </>
  );
};

UpdateProfile.propTypes = {
  id: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
};

export { UpdateProfile };
