'use strict';

/**
 * @ngdoc service
 * @name adminApp.UEditor
 * @description
 * # UEditor
 * Constant in the adminApp.
 */


angular
  .module('adminApp')
  .service('UEditor', UEditor);

UEditor.$inject = ['Config'];

function UEditor(Config) {
  return {
    //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
    //focus时自动清空初始化时的内容
    autoHeightEnabled: true,
    autoClearinitialContent:true,
    //关闭字数统计
    wordCount:false,
    UEDITOR_HOME_URL:'/libs/ueditor/',   // 在开发中注释掉
    //关闭elementPath
    elementPathEnabled:false,
    serverUrl:Config.domain + 'file/ueditorUploadImg',
    toolbars: [
      [
        'bold', //加粗
        'indent', //首行缩进
        'snapscreen', //截图
        'italic', //斜体
        'underline', //下划线
        'strikethrough', //删除线
        'formatmatch', //格式刷
        'blockquote', //引用
        'pasteplain', //纯文本粘贴模式
        'selectall', //全选
        'preview', //预览
        'horizontal', //分隔线
        'removeformat', //清除格式
        'unlink', //取消链接
        'insertparagraphbeforetable', //"表格前插入行"
        'insertcode', //代码语言
        'fontfamily', //字体
        'fontsize', //字号
        'paragraph', //段落格式
        'simpleupload', //单图上传
        'insertimage', //多图上传
        'edittable', //表格属性
        'edittd', //单元格属性
        'link', //超链接
        'emotion', //表情
        'spechars', //特殊字符
        'searchreplace', //查询替换
        'map', //Baidu地图
        'gmap', //Google地图
        'insertvideo', //视频
        'help', //帮助
        'justifyleft', //居左对齐
        'justifyright', //居右对齐
        'justifycenter', //居中对齐
        'justifyjustify', //两端对齐
        'forecolor', //字体颜色
        'backcolor', //背景色
        'insertorderedlist', //有序列表
        'insertunorderedlist', //无序列表
        'fullscreen', //全屏
        'insertframe', //插入Iframe
        'imagenone', //默认
        'imageleft', //左浮动
        'imageright', //右浮动
        'attachment', //附件
        'imagecenter', //居中
        'wordimage', //图片转存
        'lineheight', //行间距
        'edittip ', //编辑提示
        'autotypeset', //自动排版
        'touppercase', //字母大写
        'tolowercase', //字母小写
        'background', //背景
        'inserttable' //插入表格
      ]
    ]
  }
}

