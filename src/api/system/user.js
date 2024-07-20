import request from '@/utils/request.js';

const BASE_API = '/user';

export default {
  login(data) {
    return request({
      url: BASE_API + '/login',
      method: 'post',
      data,
    });
  },
  change_avatar(data) {
    return request({
      url: BASE_API + '/change_avatar',
      method: 'post',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  edit_user(data) {
    return request({
      url: BASE_API + '/edit_user',
      method: 'post',
      data,
    });
  },
  urls() {
    return request({
      url: BASE_API + '/urls',
      method: 'get',
    });
  },
  perms() {
    return request({
      url: BASE_API + '/perms',
      method: 'get',
    });
  },
  users() {
    return request({
      url: BASE_API + '/users',
      method: 'get',
    });
  },
  addUser(data) {
    return request({
      url: BASE_API + '/add_user',
      method: 'post',
      data,
    });
  },
  deleteUser(data) {
    return request({
      url: BASE_API + '/delete_user',
      method: 'post',
      data,
    });
  },
  getUser(data) {
    return request({
      url: BASE_API + '/get_user',
      method: 'post',
      data,
    });
  },
  changeUser(data) {
    return request({
      url: BASE_API + '/change_user',
      method: 'post',
      data,
    });
  },
};
