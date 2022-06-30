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

  getUsers() {
    return this._http.load(
      `${this._apiPath}${ApiPath.USERS}${UsersApiPath.ROOT}`,
      {
        method: HttpMethod.GET
      }
    );
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
}

export { User };
