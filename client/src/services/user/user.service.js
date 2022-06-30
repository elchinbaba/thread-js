import {
  ApiPath,
  UsersApiPath,
  HttpMethod,
  ContentType
} from 'common/enums/enums';

class User {
  constructor({ apiPath, http }) {
    this._apiPath = apiPath;
    this._http = http;
  }

  updateUser(id, data) {
    return this._http.load(
      `${this._apiPath}${ApiPath.USERS}${UsersApiPath.ROOT}${id}`,
      {
        method: HttpMethod.PUT,
        contentType: ContentType.JSON,
        payload: JSON.stringify({ id, data })
      }
    );
  }

  getUsers() {
    return this._http.load(
      `${this._apiPath}${ApiPath.USERS}${UsersApiPath.ROOT}`,
      {
        method: HttpMethod.GET
      }
    );
  }

  getUser(id) {
    return this._http.load(
      `${this._apiPath}${ApiPath.USERS}${UsersApiPath.ROOT}${id}`,
      {
        method: HttpMethod.GET
      }
    );
  }
}

export { User };
