import client from "./client";

const config = {
  headers: {
    Authorization: `Bearer quang`,
  },
};
const API_PREFIX = {
  API_SETTING_BRANCH: "/api.branch",
  API_SETTING_DEPARTMENT: "/api.department",
  API_SETTING_POSITION: "/api.position",
  API_SETTING_SHIFT: "/api.shift",
  API_PROVINCE: "/api.province",
  API_DISTRICT: "/api.district",
  API_WARD: "/api.ward",
};

export const api = {
  branch: {
    getBranchList: (params) => {
      return client.get(API_PREFIX.API_SETTING_BRANCH, {
        params: params,
      });
    },
    postBranch: (bodyParams) => {
      return client.post(API_PREFIX.API_SETTING_BRANCH, bodyParams);
    },
    putBranch: (bodyParams, id) => {
      return client.put(API_PREFIX.API_SETTING_BRANCH + `/${id}`, bodyParams);
    },
    getBranch: (id) => {
      return client.get(API_PREFIX.API_SETTING_BRANCH + `/${id}`);
    },
    deleteBranch: (id) => {
      return client.delete(API_PREFIX.API_SETTING_BRANCH + `/${id}`);
    },
  },
  department: {
    getDepartmentList: (params) => {
      return client.get(API_PREFIX.API_SETTING_DEPARTMENT, {
        params: params,
      });
    },
    postDepartment: (bodyParams) => {
      return client.post(API_PREFIX.API_SETTING_DEPARTMENT, bodyParams);
    },
    putDepartment: (bodyParams, id) => {
      return client.put(
        API_PREFIX.API_SETTING_DEPARTMENT + `/${id}`,
        bodyParams
      );
    },
    getDepartment: (id) => {
      return client.get(API_PREFIX.API_SETTING_DEPARTMENT + `/${id}`);
    },
    deleteDepartment: (id) => {
      return client.delete(API_PREFIX.API_SETTING_DEPARTMENT + `/${id}`);
    },
  },
  position: {
    postPosition: (bodyParams) => {
      return client.post(API_PREFIX.API_SETTING_POSITION, bodyParams);
    },
    getPositionList: (params) => {
      return client.get(API_PREFIX.API_SETTING_POSITION, {
        params: params,
      });
    },
    getPosition: (id) => {
      return client.get(API_PREFIX.API_SETTING_POSITION + `/${id}`);
    },
    putPosition: (bodyParams, id) => {
      return client.put(API_PREFIX.API_SETTING_POSITION + `/${id}`, bodyParams);
    },
    deletePosition: (id) => {
      return client.delete(API_PREFIX.API_SETTING_POSITION + `/${id}`);
    },
  },
  shift: {
    postShift: (bodyParams) => {
      return client.post(API_PREFIX.API_SETTING_SHIFT, bodyParams);
    },
    getShiftList: (params) => {
      return client.get(API_PREFIX.API_SETTING_SHIFT, {
        params: params,
      });
    },
    getShift: (id) => {
      return client.get(API_PREFIX.API_SETTING_SHIFT + `/${id}`);
    },
    putShift: (bodyParams, id) => {
      return client.put(API_PREFIX.API_SETTING_SHIFT + `/${id}`, bodyParams);
    },
    deleteShift: (id) => {
      return client.delete(API_PREFIX.API_SETTING_SHIFT + `/${id}`);
    },
  },
  location: {
    getProvinceInfo: (provinceID) => {
      return client.get(API_PREFIX.API_PROVINCE + `/${provinceID}`);
    },
    getProvinceList: () => {
      return client.get(API_PREFIX.API_PROVINCE, null, config);
    },
    getDistrictList: (provinceID) => {
      return client.get(API_PREFIX.API_PROVINCE + `/${provinceID}/district`);
    },
    getDistrictInfo: (districtID) => {
      return client.get(API_PREFIX.API_DISTRICT + `/${districtID}`);
    },
    getWardList: (districtID) => {
      return client.get(API_PREFIX.API_DISTRICT + `/${districtID}/ward`);
    },
    getWardInfo: (wardID) => {
      return client.get(API_PREFIX.API_WARD + `/${wardID}`);
    },
  },
};