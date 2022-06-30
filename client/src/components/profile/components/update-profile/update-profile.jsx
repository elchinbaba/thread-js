import { useCallback, useDispatch, useState } from 'hooks/hooks';

import PropTypes from 'prop-types';

import { threadActionCreator } from 'store/actions';

const UpdateProfile = ({ id, username }) => {
  const dispatch = useDispatch();

  const [_username, setUsername] = useState(username);

  const handleClick = useCallback(() => {
    dispatch(threadActionCreator.updateUser({ id, username: _username }));
  }, [_username, dispatch]);

  return (
    <>
      <input type="text" value={_username} onChange={event => setUsername(event.target.value)} />
      <button type="button" onClick={handleClick}>OK</button>
    </>
  );
};

UpdateProfile.propTypes = {
  id: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired
};

export { UpdateProfile };
