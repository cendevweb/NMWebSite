(function(){

  'use strict';
	angular
    .module('pucheApp')
    .directive('adminProject', function(){
     return {
        restrict: 'E',
        scope : {projet : "="},
        templateUrl: 'scripts/directives/adminProject.html',
        controller : function($scope,AdminService,anchorSmoothScroll,$anchorScroll,$location,$rootScope,$state,$timeout){
            $scope.$on('reloadSql', function() {  
                AdminService.getPickedProject().then(function(response){
                        $scope.currentProject = response;
                });      
            });
            $scope.socket = io.connect('/');
            $scope.showInnerAlert = false;
            $scope.pickNextProject = function(){
                var keys = Object.keys($rootScope.projectList);
                $scope.len = keys.length;
                AdminService.getPickedProject().then(function(response){
                        $scope.currentProject = response;
                        var nextProjectString = $scope.currentProject.id+1
                        if (nextProjectString == $scope.len+1){
                            nextProjectString = 1
                        }
                        var picked = $rootScope.projectList[nextProjectString-1];
                        AdminService.setPickedProject(picked).then(function(response) { 
                            $scope.currentProject = response;
                        });
                });
            }
            $scope.pickPreviousProject = function(){
                var keys = Object.keys($rootScope.projectList);
                $scope.len = keys.length;
                AdminService.getPickedProject().then(function(response){
                        $scope.currentProject = response;
                        var nextProjectString = $scope.currentProject.id-1;
                        if (nextProjectString == 0){
                            nextProjectString = $scope.len
                        }
                        var picked = $rootScope.projectList[nextProjectString-1];
                        AdminService.setPickedProject(picked).then(function(response) { 
                            $scope.projet = response;
                        });
                });
            }
            $scope.delete = function(){
                $scope.socket.emit('deleteProject', $scope.currentProject.id);
                $scope.socket.on('projectDeleted', function (data) {
                    $rootScope.projectList = {}; 
                    $rootScope.projectList = data;
                    $scope.$apply(function() { $scope.showInnerAlert = true, $scope.alertMsg = "projet supprimer avec succès", $scope.alertType='success',$scope.currentProject={}});
                    $timeout(function() {
                         $scope.$apply(function() {$scope.showInnerAlert = false});
                    }, 3000)

                });

            }
            $scope.modif = function(project){
                $scope.socket.emit('modifProject', project);
                $scope.socket.on('projectModified', function(data){
                    $rootScope.projectList = {}; 
                    $rootScope.projectList = data;
                    $scope.$apply(function() { $scope.showInnerAlert = true, $scope.alertMsg = "projet modifier avec succès", $scope.alertType='success'});
                    $timeout(function() {
                         $scope.$apply(function() {$scope.showInnerAlert = false});
                    }, 3000)
                })
            }
        }
     };
   });

})();
