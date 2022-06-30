import PropTypes from 'prop-types';

const HoveredPost = ({ likers }) => {
  return (
    <>
      {likers.map(liker => <span key={liker}>{liker.concat(' ')}</span>)}
    </>
  );
};

HoveredPost.propTypes = {
  likers: PropTypes.arrayOf(PropTypes.string).isRequired
};

export { HoveredPost };
