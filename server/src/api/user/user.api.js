import { UsersApiPath, ControllerHook, HttpMethod } from '../../common/enums/enums.js';

const initUser = (fastify, opts, done) => {
  const { user: userService } = opts.services;

  fastify.route({
    method: HttpMethod.GET,
    url: UsersApiPath.ROOT,
    [ControllerHook.HANDLER]: () => userService.getUsers()
  });
  fastify.route({
    method: HttpMethod.PUT,
    url: UsersApiPath.$ID,
    [ControllerHook.HANDLER]: req => userService.updateUser(req.body.id, req.body.data)
  });

  done();
};

export { initUser };