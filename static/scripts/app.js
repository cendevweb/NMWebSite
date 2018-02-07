(function(){

  'use strict';
	const app = angular.module('pucheApp', ['ui.router','ui.bootstrap','ngAnimate']);

  app.config(["$locationProvider", function($locationProvider) {
  $locationProvider.html5Mode(true);
  }]);
  app.config(function($stateProvider,$urlRouterProvider){

    /**
    * Configuration des routes de mon application
    */

    $stateProvider
      .state({
        name: 'home',
        url: '/',
        templateUrl: '/scripts/module/home/home.html',
        controller:'homeCtrl',
        controllerAs : 'home'
      }).state({
        name: 'admin',
        url: '/admin',
        templateUrl: '/scripts/module/admin/admin.html',
        controller:'adminCtrl',
        controllerAs : 'admin'
      })
  });


})();
