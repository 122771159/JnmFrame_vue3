import request from '@/utils/request.js';

const BASE_API = '/role';

export default {
  roles(data = {}) {
    return request({
      url: BASE_API + '/roles',
      method: 'get',
      data,
    });
  },
  perms(data = {}) {
    return request({
      url: BASE_API + '/perms',
      method: 'get',
      data,
    });
  },
  permsById(data = {}) {
    return request({
      url: BASE_API + '/perms_id',
      method: 'get',
      params: data,
    });
  },
  deleteAddPerms(data = {}) {
    return request({
      url: BASE_API + '/delete_add_perms',
      method: 'post',
      data,
    });
  },
  urls(params = {}) {
    return request({
      url: BASE_API + '/urls',
      method: 'get',
      params,
    });
  },
  deleteAddUrls(data = {}) {
    return request({
      url: BASE_API + '/delete_add_urls',
      method: 'post',
      data,
    });
  },
  addRole(data = {}) {
    return request({
      url: BASE_API + '/add_role',
      method: 'post',
      data,
    });
  },
  delete_role(data = {}) {
    return request({
      url: BASE_API + '/delete_role',
      method: 'post',
      data,
    });
  },
  changeNameRole(data = {}) {
    return request({
      url: BASE_API + '/change_name_role',
      method: 'post',
      data,
    });
  },
  changePerm(data = {}) {
    return request({
      url: BASE_API + '/change_perm',
      method: 'post',
      data,
    });
  },
  deletePerm(data = {}) {
    return request({
      url: BASE_API + '/delete_perm',
      method: 'post',
      data,
    });
  },
  addPerm(data = {}) {
    return request({
      url: BASE_API + '/add_perm',
      method: 'post',
      data,
    });
  },
  deleteUrl(data = {}) {
    return request({
      url: BASE_API + '/delete_url',
      method: 'post',
      data,
    });
  },
  change_url(data = {}) {
    return request({
      url: BASE_API + '/change_url',
      method: 'post',
      data,
    });
  },
};
