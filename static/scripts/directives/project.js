(function(){

  'use strict';
	angular
    .module('pucheApp')
    .directive('project', function(){
     // Runs during compile
     return {
        restrict: 'E',
        scope : {projet : "="},
        templateUrl: 'scripts/directives/project.html',
        controller : function($scope,PucheService,anchorSmoothScroll,$anchorScroll,$location,$rootScope,$timeout){
            $scope.animateProject = 0
            $scope.closePickedProject = function(){
                $location.hash('projectList');
                // $rootScope.animateProject = 1;
                // $timeout(function() {
                    $rootScope.interPicked = false;
                    anchorSmoothScroll.scrollTo('logoNm');
                // },500);
            }
            $scope.pickNextProject = function(){
                var keys = Object.keys($rootScope.projectList);
                $scope.len = keys.length;
                PucheService.getPickedProject().then(function(response){
                    $rootScope.animateProject = 1;
                    $timeout(function() {
                        $scope.currentProject = response;
                        var nextProjectString = $scope.currentProject.id+1
                        if (nextProjectString == $scope.len+1){
                            nextProjectString = 1
                        }
                        var picked = $rootScope.projectList[nextProjectString-1];
                        PucheService.setPickedProject(picked).then(function(response) { 
                            $scope.projet = response;
                        });
                        $rootScope.animateProject = 0;
                    }, 700);
                });
            }
            $scope.pickPreviousProject = function(){
                var keys = Object.keys($rootScope.projectList);
                $scope.len = keys.length;
                PucheService.getPickedProject().then(function(response){
                    $rootScope.animateProject = 1;
                    $timeout(function() {
                        $scope.currentProject = response;
                        var nextProjectString = $scope.currentProject.id-2;
                        if (nextProjectString == 0){
                            nextProjectString = $scope.len
                        }
                        var picked = $rootScope.projectList[nextProjectString-1];
                        PucheService.setPickedProject(picked).then(function(response) { 
                            $scope.projet = response;
                        });
                        $rootScope.animateProject = 0;
                    }, 700);
                });
            }

        }
     };
   });

})();
