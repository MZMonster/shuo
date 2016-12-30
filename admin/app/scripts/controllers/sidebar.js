'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:SidebarCtrl
 * @description
 * # SidebarCtrl
 * Controller of the adminApp
 */
angular
  .module('adminApp')
  .controller('SidebarCtrl', SidebarCtrl);

SidebarCtrl.$inject = ['$scope', '$location', 'Site', 'Config', '$http'];

function SidebarCtrl($scope, $location, Site, Config, $http) {
  var vm = $scope;

  var activeID = -1;
  var subActiveID = -1;
  var tabActiveIndex = -1;
  vm.targetSite = '';
  vm.isSidebarCollapse = false;

  vm.toggleMenu = toggleMenu;
  vm.toggleSiderbar = toggleSiderbar;
  vm.close = close;
  vm.setSite = setSite;
  vm.logout = logout;
  vm.tabs = [];



  $scope.$on('$routeChangeSuccess', routeChange);
  $scope.$on(Config.tabEvent, manageTab);
  /**
   * 初始化
   */
  initSites();
  function setSite() {
    vm.menu = getMenu(vm.targetSite);
  }

  function initSites() {
    Site.findAll().then(function (res) {
      vm.sites = res;
      vm.targetSite = vm.sites[0].sitename;
      setSite();

    })
  }

  function logout() {
    $http.get(Config.domain + 'admin/logout').then(function(data) {
      location.reload();
    });
  }

  function getMenu(targetSite) {
    return [
      {
        id: 1,
        title: '用户管理',
        isActive: false,
        icon: Config.icon.user,
        main: [
          {
            label: '全部用户',
            route: targetSite + '/users',
            isActive: false
          }
        ]
      },
      {
        id: 2,
        title: '评论管理',
        isActive: false,
        icon: Config.icon.comment,
        main: [
          {
            label: '全部评论',
            route: targetSite + '/comments'
          }
        ]
      },
      {
        id: 3,
        title: '文章管理',
        isActive: false,
        icon: Config.icon.thread,
        main: [
          {
            label: '全部文章',
            route: targetSite + '/threads'
          }
        ]
      },
      {
        id: 4,
        title: '设置',
        isActive: false,
        icon: Config.icon.site,
        main: [
          {
            label: '站点信息设置',
            route: targetSite + '/setting'
          }
        ]
      },
      {
        id: 5,
        title: '评论导入',
        isActive: false,
        icon: Config.icon.site,
        main: [
          {
            label: '导入',
            route: targetSite + '/data/import'
          }
        ]
      },
      {
        id: 6,
        title: '管理员设置',
        isActive: false,
        icon: Config.icon.user,
        main: [
          {
            label: '管理员列表',
            route:  '/administrator',
            isActive: false
          },
          {
            label: '新增管理员',
            route: '/administrator/new',
            isActive: false
          }
        ]
      },
      {
        id: 7,
        title: '站点管理',
        isActive: false,
        icon: Config.icon.comment,
        main: [
          {
            label: '站点列表',
            route: '/sites'
          },
          {
            label: '新增列表',
            route: '/site/new'
          }
        ]
      }
    ];
  }

  /**
   *
   * @param id
   * @param sid
   * @param level
   */
  function toggleMenu(id, sid, level) {

    id = id - 1;

    if (activeID != -1 && activeID != id) {
      vm.menu[activeID].isActive = false;
    }
    if (subActiveID != -1) {
      vm.menu[activeID].main[subActiveID].isActive = false;
    }

    vm.menu[id].isActive = !vm.menu[id].isActive;

    if (level > 0) {
      vm.menu[id].isActive = true;
      vm.menu[id].main[sid].isActive = true;
    }

    activeID = id;
    subActiveID = sid;
  }

  /**
   * 收缩、扩张 siderbar
   */
  function toggleSiderbar() {
    vm.isSidebarCollapse = !vm.isSidebarCollapse;
  }

  /**
   * 当 tag 被关闭的时候触发
   * 删除一个 tag
   */
  function close(index) {
    vm.tabs.splice(index, 1);

    if (index == tabActiveIndex) {
      if (vm.tabs.length) {
        tabActiveIndex = vm.tabs.length - 1;
        $location.path(vm.tabs[tabActiveIndex].path);
      } else {
        tabActiveIndex = - 1;
      }
    }
  }

  function manageTab(event, tab) {
    var existKey = -1;

    if (tabActiveIndex != -1) {
      vm.tabs[tabActiveIndex].isActive = false;
    }

    for(var i = 0; i < vm.tabs.length; i++) {
      if (vm.tabs[i].path == tab.path) {
        existKey = i;
        break;
      }
    }

    if (existKey == -1) {
      if(vm.tabs.length == 7) {
        vm.tabs.splice(0, 1);
      }

      tab.isActive = true;
      vm.tabs.push(tab);
      tabActiveIndex = vm.tabs.length - 1;
    } else {
      tabActiveIndex = existKey;
      vm.tabs[tabActiveIndex].isActive = true;
    }
  }

  /**
   * 路由改变监听方法
   * 如果当前路由不等于状态为 active 的路由，则取消 active
   * @param next
   * @param current
   */
  function routeChange(next, current) {
    if (tabActiveIndex != -1) {
      if ($location.path() != vm.tabs[tabActiveIndex].path) {
        vm.tabs[tabActiveIndex].isActive = false;
        tabActiveIndex = -1;
      }
    }
  }


}
