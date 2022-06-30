import { useSelector, useState, useDispatch } from 'hooks/hooks';
import { useCallback } from 'react';
import { threadActionCreator } from 'store/actions';

import { Modal } from 'components/common/common.js';

const UpdatePost = () => {
  const dispatch = useDispatch();

  const { post } = useSelector(state => ({
    post: state.posts.updatePost
  }));

  const [body, setBody] = useState(post.body);

  const handleUpdatePostToggle = useCallback(id => (
    dispatch(threadActionCreator.toggleUpdatePost(id))
  ), [dispatch]);

  const handleClick = useCallback(() => {
    dispatch(threadActionCreator.updatePost({ id: post.id, body }));
    handleUpdatePostToggle();
  }, [body, dispatch]);

  const handleUpdatePostClose = () => handleUpdatePostToggle();

  return (
    <Modal
      isOpen
      onClose={handleUpdatePostClose}
    >
      <input type="text" value={body} onChange={event => setBody(event.target.value)} />
      <button type="button" onClick={handleClick}>OK</button>
    </Modal>
  );
};

export { UpdatePost };
