/**
 * Copyright (c) 2014 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/3/13
 * @description
 *
 */

module.exports.upload = {
  imgHost: '/',
  development: {
    upyun: {
      adapter: require("skipper-upyun"),
      bucket: '',
      operator: '',
      password: '',
      endpoint: 'v0',
      apiVersion: 'legacy',
      perMaxBytes: 10000000, // 允许上传单个文件的大小, 约4M
      acceptTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/jpg'], // 允许上传文件的类型
      basePath: '/res/' // 相对于upyun服务器根目录的目录
    }
  },
  production: {
    upyun: {
      adapter: require("skipper-upyun"),
      bucket: '',
      operator: '',
      password: '',
      endpoint: 'v0',
      apiVersion: 'legacy',
      perMaxBytes: 10000000, // 允许上传单个文件的大小, 约 4M
      acceptTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/jpg'], // 允许上传文件的类型
      basePath: '/res/' // 相对于upyun服务器根目录的目录
    }
  }
};