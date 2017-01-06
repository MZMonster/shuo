# BUG解决 备忘录

## 关于Hanldebars的问题

sails 自身会依赖`express-handlebars`包，        
而在 `views/helper/index.js` 文件中的 `var Handlebars = require('handlebars')`    
会引入 `node_modules/handlebars`    

而`sails`程序本身引入的是 `node_modules/express-handlebars/handlebars`。    

这就导致sails的 `res.view` 使用的渲染引擎的handlerbars依赖，    
和`views/helper/index.js`中使用的hanldebars依赖使用的不是同一个代码。    
就会导致，运行的时候，报「找不到xx helper」的错误。    

项目中目前解决办法：    
1. 手动删除 `node_modules/express-handlebars/handlebars`,让sails引入 `node_modules/handlebars`.(明显不是好办法)    
2. 修改 `views/helper/index.js` 中引入的handlebars的路径。（不兼容npm v3）    

### 源码阅读记录

项目启动的时候，会启用 `node_modules/sails/lib/hooks/views/render.js` 是 `res.render` 的定义，    
文件中有这么一句    
```
// Render the view
sails.config.views.engine.fn(absPathToView, options, cb_view); 
```

这证明，调用 `res.render` 的时候，实际上是调用了 `sails.config.views.engine.fn` 方法。    
而，这个方法，实在项目启动的时候，`sails/lib/hooks/views/configure.js` 中进行初始化的。    
查看 `configure.js` 文件，会发现这么一句：    
```
fn = consolidate(appDependenciesPath)[engineName];
```

fn这个函数，是通过`consolidate`来进行初始化的,这个函数由`sails/lib/hooks/views/consolidate.js` 来提供    
再看`consolidate.js`，    
发现这是TJ大神写的一个集成常见的Nodejs模板引擎的函数，其中:    
```
  fns.handlebars.render = function(str, options, fn) {
    var engine = requires.handlebars || (requires.handlebars = require(sailsAppPath + '/handlebars'));
    try {
      for (var partial in options.partials) {
        engine.registerPartial(partial, options.partials[partial]);
      }
      for (var helper in options.helpers) {
        engine.registerHelper(helper, options.helpers[helper]);
      }
      var tmpl = cache(options) || cache(options, engine.compile(str, options));
      fn(null, tmpl(options));
    } catch (err) {
      fn(err);
    }
  };
```

是引入`handlebars`的关键代码，第一次调用redner的时候，会进行require，随后会缓存起来。    
而`handlebars`的路径，是由外部传入的`sailsAppPath`控制。    
输出`sailsAppPath`,是：    
```
{ appDependenciesPath: '/Users/JerryC/Work/Workspaces/Bigertech/open-shuo/node_modules' }
```

那么问题来了，这样引用，肯定是引用的顶层目录的`handlebars`,怎么就会引用到了 `node_modules/express-handlebar/handlebar`去了呢。    


**题外话：**

从查看源码的来看，我们可以定义`sails.config.views.engine`，进行fn的拦截与改造:
```
module.exports.views = {
  engine: {
    name: 'handlebars',
    ext: 'handlebar',
    fn: function() {...}
  }
}
```

## 最终解决办法
参考 npm v3 的[模块机制](https://docs.npmjs.com/how-npm-works/npm3)，发现 package.json 中手动引入新版本的 `handlebars` ([源码](https://github.com/MZMonster/shuo/blob/f8c2d18de0186157508bc24b2d9df1a5b6cc499c/package.json#L39)) 是一个愚蠢的行为。     
避免`package.json` 中引入更高版本的 `handlebars`。    
可以保证业务代码 `require('handlebars')` 的时候和sails内部 `require('handlebars')` 是引用的同一个依赖。    

*PS: 需要要注意的是，该项目，依赖于`npm v3`, 如果使用旧版本的npm，会导致依赖包的问题。*
