import { useAppForm, useSelector, useState } from 'hooks/hooks';
import { Image, Input } from 'components/common/common';
import { DEFAULT_USER_AVATAR } from 'common/constants/constants';
import { ImageSize, IconName } from 'common/enums/enums';
import styles from './styles.module.scss';

import { UpdateProfile } from './components/update-profile/update-profile.jsx';

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

  const handleEdit = () => setEdit(!edit);

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
      {edit && <UpdateProfile id={user.id} username={user.username} />}
    </form>
  );
};

export { Profile };
