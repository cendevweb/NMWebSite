(function(){

  'use strict';
	angular
    .module('pucheApp')
    .directive('adminProject', function(){
     return {
        restrict: 'E',
        scope : {projet : "="},
        templateUrl: 'scripts/directives/adminProject.html',
        controller : function($scope,AdminService,anchorSmoothScroll,$anchorScroll,$location,$rootScope,$state){
            $scope.$on('someEvent', function() {  
                AdminService.getPickedProject().then(function(response){
                        $scope.currentProject = response;
                });      
            });
            $scope.socket = io.connect('/');
            $scope.pickNextProject = function(){
                var keys = Object.keys($rootScope.projectList);
                $scope.len = keys.length;
                AdminService.getPickedProject().then(function(response){
                        $scope.currentProject = response;
                        console.log($scope.currentProject)
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
                console.log('hey')
                $scope.socket.emit('deleteProject', $scope.currentProject.id);
                $scope.socket.on('projectDeleted', function (data) {
                    $rootScope.projectList = {}; 
                    $rootScope.projectList = data; 
                    alert("projet supprimer avec succès");

                });

            }
            $scope.modif = function(project){
                $scope.socket.emit('modifProject', project);
                $scope.socket.on('projectModified', function(data){
                    $rootScope.projectList = {}; 
                    $rootScope.projectList = data;
                    console.log(data) 
                    alert("projet modifier avec succès");
                })
            }
        }
     };
   });

})();
