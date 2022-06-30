import { useCallback, useDispatch, useState } from 'hooks/hooks';

import PropTypes from 'prop-types';

import { threadActionCreator } from 'store/actions.js';

const ResetPassword = ({ id, reset }) => {
  const dispatch = useDispatch();

  const [_reset, setReset] = useState(false);
  const [checkReset, setCheckReset] = useState('');
  const [password, setPassword] = useState('');

  const handleCheck = () => {
    if (+checkReset === reset) {
      setReset(true);
    }
  };

  const handleResetPassword = useCallback(() => {
    if (password.length > 3) {
      dispatch(threadActionCreator.updateUserPassword({ id, password }));
    }
  }, [password, dispatch]);

  return _reset ? (
    <>
      <input type="text" value={password} onChange={event => setPassword(event.target.value)} />
      <button type="button" onClick={handleResetPassword}>OK</button>
    </>
  ) : (
    <>
      <input type="text" value={checkReset} onChange={event => setCheckReset(event.target.value)} />
      <button type="button" onClick={handleCheck}>Input 6 Digit Number</button>
    </>
  );
};

ResetPassword.propTypes = {
  id: PropTypes.number.isRequired,
  reset: PropTypes.number.isRequired
};

export { ResetPassword };
