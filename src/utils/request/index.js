import Axios from 'axios';
import { clearToken, getToken } from '@/tools/cookiesStorage.js'; 
import { addPendingRequest, removePendingRequest } from './cancelRepeatRquest'; // 取消重复请求
import { againRequest } from './requestAgainSend'; // 请求重发
import { requestInterceptor as cacheReqInterceptor, responseInterceptor as cacheResInterceptor } from './requestCache';
import { Notification } from 'antd';


// 返回结果处理
// 自定义约定接口返回{code: xxx, data: xxx, msg:'err message'}
const responseHandle = {
  200: response => {
      return response.data.data;
  },
  401: response => {
      Notification({
          title: '认证异常',
          message: '登录状态已过期，请重新登录！',
          type: 'error'
      });
    //   clearToken();
      window.location.href = window.location.origin;
  },
  default: response => {
      Notification({
          title: '操作失败',
          message: response.data.msg,
          type: 'error'
      });
      return Promise.reject(response);
  }
};

const axios = Axios.create({
  baseURL: process.env.VUE_APP_BASEURL || '',
  timeout: 50000
});


// 添加请求拦截器
axios.interceptors.request.use(
  async function(config) {
      // 请求头用于接口token 认证
    //   getToken() && (config.headers['Authorization'] = getToken());

      if (config.method.toLocaleLowerCase() === 'post' || config.method.toLocaleLowerCase() === 'put') {
          // 参数统一处理，请求都使用data传参
          config.data = config.data.data;
      } else if (config.method.toLocaleLowerCase() === 'get' || config.method.toLocaleLowerCase() === 'delete') {
          // 参数统一处理
          config.params = config.data;
      } else {
          alert('不允许的请求方法：' + config.method);
      }
      // pendding 中的请求，后续请求不发送（由于存放的peddingMap 的key 和参数有关，所以放在参数处理之后）
      addPendingRequest(config); // 把当前请求信息添加到pendingRequest对象中
      //  请求缓存
      cacheReqInterceptor(config, axios);
      return config;
  },
  function(error) {
      return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  async response => {
      // 响应正常时候就从pendingRequest对象中移除请求
      removePendingRequest(response);
      cacheResInterceptor(response);
      return responseHandle[response.data.code || 'default'](response);
  },
  error => {
      // 从pending 列表中移除请求
      removePendingRequest(error.config || {});
      // 需要特殊处理请求被取消的情况
      if (!Axios.isCancel(error)) {
          // 请求重发
          againRequest(error, axios);
      }
      // 请求缓存处理方式
      if (Axios.isCancel(error) && error.message.data && error.message.data.config.cache) {
          return Promise.resolve(error.message.data.data.data); // 返回结果数据
      }
      return Promise.reject(error);
  }
);

export default axios;