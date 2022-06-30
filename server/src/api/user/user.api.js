import { UsersApiPath, ControllerHook, HttpMethod } from '../../common/enums/enums.js';

const initUser = (fastify, opts, done) => {
  const { user: userService } = opts.services;

  fastify.route({
    method: HttpMethod.GET,
    url: UsersApiPath.ROOT,
    [ControllerHook.HANDLER]: () => userService.getUsers()
  });

  done();
};

export { initUser };