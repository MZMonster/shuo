# shuo使用文档

### 配置方法

**示例**

```
<div id="MW_SHUO">

</div>


<script src="assets/js/shuo.api.2.0.0.min.js"> </script>

<script>
  window.shuo.api.config({
    target: 'MW_SHUO', // 可选,默认MW_SHUO
    appid: 'VkHiN7zHl',
    sourceID: '9c9971ae-89b3-46a3-ae88-c41093484749',
    category: 'product',
//    sourceID: 'c76545f2-e461-4fa9-90d1-a19b6585a490',
//    category: 'company',
//    sourceID: '33f8728a-ae01-49c7-b0f5-e561dd5ec853',
//    category: 'topic',
//    sourceID: 'e639dfe1-64d8-4bc5-b41e-eea37dbf1158',
//    category: 'category',
//    title: ,
//    url: ,
//    limit: ,
//    image: ,
//    description: ,
    user_info_url: 'http://127.0.0.1:9001/userInfo',  // 用户信息接口
    user_login_url: 'http://127.0.0.1:9001/login?return_to=',  // 用户登录链接
    render: 'shuo.new.2.0.0.min.js',  // 自定义渲染js
    cmt_title: '短评', // 自定义评论标题,默认为"评论"
    cmt_placeholder: '添加评论',  // 自定义评论框的提示语, 默认为空
    emoji_url: 'assets/img'
  });
</script>

```

### config 属性

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| target | string | 渲染目标DOM的id |
| appid | string | 调用shuo的站点id  |
| sourceID | string | 评论的产品、文章、公司列表、类别列表、话题等的uuid |
| category | string | 评论的类型，包括’product’,’post’,’company’,’topic’,’category’,’talk' |
| title | string | 标题 |
| url | string | 地址 |
| limit | integer | 每页显示条数 |
| image | string | 图片 |
| description | string | 摘要  |
| uer_info_url | string | 用户信息接口 |
| user_login_url | string | 用户登录链接 |
| cmt_title | string | 自定义评论标题,默认为"评论" |
| cmt_placeholder | string | 自定义评论框的提示语, 默认为空 |
| emoji_url | string | emoji插件静态资源路径 |
| render | string | 自定义渲染js |
| sort | string | 排序方式，包括'new','old','hot' |
| flat | bool | 父评论是否与子评论同一层级 |
| debug | bool | 是否为debug模式 |
| version | string | shuo版本号 |

**说明**

- 目前shuo有两个版本，分别被默认的`shuo.render.js`与`shuo.new.js`所渲染，它们会各自引用不同的样式（分别为`shuo-default.css`与`shuo-new.css`）
- wan-client项目的pc版和mob移动端的shuo项目，除了`产品详情页`、`文章详情页`、`话题讨论页`内的shuo加载的是new的版本，其他都使用旧版本
- 现在shuo的资源都加入了基于项目内`package.json`里version字段的版本号，每次更新版本号之后，需要手动更改，wan项目中引入shuo的脚本分别在`views/partials/basic/shuo`、`views/page/shuo/commengPage`，后者还需要更改config.render属性内引入的脚本版本号
- 当`debug`字段为true时，wan项目会跑未压缩版本的shuo代码；为false时，跑带有版本号的被压缩过的代码
