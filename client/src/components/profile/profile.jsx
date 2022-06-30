import emailjs from 'emailjs-com';
import { useEffect, useAppForm, useSelector, useState } from 'hooks/hooks';
import { Image, Input } from 'components/common/common';
import { DEFAULT_USER_AVATAR } from 'common/constants/constants';
import { ImageSize, IconName } from 'common/enums/enums';
import styles from './styles.module.scss';

import { UpdateProfile } from './components/update-profile/update-profile.jsx';
import { ResetPassword } from './components/reset-password/reset-password.jsx';

import { generateRandom6DigitNumber } from './helpers/helpers.js';

const Profile = () => {
  const { user } = useSelector(state => ({
    user: state.profile.user
  }));

  const { control } = useAppForm({
    defaultValues: {
      username: user.username,
      email: user.email,
      status: user.status
    }
  });

  const [edit, setEdit] = useState(false);
  const [reset, setReset] = useState('');

  const sendEmail = () => {
    const templateParams = {
      to_name: user.username,
      from_name: 'Thread JS service',
      message: `Your 6 digit number is ${reset}`
    };
    emailjs.send('service_qivn9db', 'template_zc4km9h', templateParams, 'ZTcl9IN3atM90an7Z');
  };

  const handleEdit = () => setEdit(!edit);
  const handleReset = () => {
    setReset(generateRandom6DigitNumber());
  };

  useEffect(() => {
    if (reset) {
      console.log(reset); // use to avoid wasting quota of emailjs service
      sendEmail(); // comment this line to avoid wasting quota of emailjs service
    }
  }, [reset]);

  return (
    <form name="profile" className={styles.profile}>
      <Image
        alt="profile avatar"
        isCentered
        src={user.image?.link ?? DEFAULT_USER_AVATAR}
        size={ImageSize.MEDIUM}
        isCircular
      />
      <fieldset disabled className={styles.fieldset}>
        <Input
          iconName={IconName.USER}
          placeholder="Username"
          name="username"
          value={user.username}
          control={control}
        />
        <Input
          iconName={IconName.AT}
          placeholder="Email"
          name="email"
          type="email"
          value={user.email}
          control={control}
        />
        <Input
          iconName={IconName.STATUS}
          placeholder="Status"
          name="status"
          type="status"
          value={user.status}
          control={control}
        />
      </fieldset>
      <button type="button" onClick={handleEdit}>Edit</button>
      {edit && <UpdateProfile id={user.id} username={user.username} status={user.status} />}
      <button type="button" onClick={handleReset}>Reset password</button>
      {reset && <ResetPassword id={user.id} reset={reset} />}
    </form>
  );
};

export { Profile };
