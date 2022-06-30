import {
  ApiPath,
  UsersApiPath,
  HttpMethod
} from 'common/enums/enums';

class User {
  constructor({ apiPath, http }) {
    this._apiPath = apiPath;
    this._http = http;
  }

  getUsers() {
    return this._http.load(
      `${this._apiPath}${ApiPath.USERS}${UsersApiPath.ROOT}`,
      {
        method: HttpMethod.GET
      }
    );
  }
}

export { User };
