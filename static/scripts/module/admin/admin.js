(function(){

	'use strict';
	angular
	.module('pucheApp')
	.controller('adminCtrl', adminCtrl);

	function adminCtrl(AdminService,$anchorScroll,$location,anchorSmoothScroll,$rootScope,$scope,$timeout){
		const admin = this;
		admin.h1Value = "Connexion à l'espace administration";
		admin.showedBlock = "log";
		admin.showMenu = false;
		$rootScope.showAlert = false;
		$rootScope.interPicked = false;
		admin.picked = {}
		admin.socket = io.connect('/');
		admin.socket.on('onProjectList', function (data) {
            $rootScope.projectList = data;
        });
		$scope.$watch('admin.showPassword',function(newVal){ if(newVal) { admin.typeInput = 'text'; } else { admin.typeInput = 'password'; } });
		admin.log = function(){
			admin.socket.emit('logAdmin', {"username":admin.logUser,"password":admin.logPass});
				
			admin.socket.on('successLog', function(){
				 $scope.$apply(function() { admin.showedBlock = "add", admin.h1Value = "Ajouter un projet",admin.showMenu = true, $rootScope.showAlert = true, $rootScope.alertMsg = "Connexion réussi", $rootScope.alertType='success'});
				$timeout(function() {
		   			 $scope.$apply(function() {$rootScope.showAlert = false});
		   		}, 3000)				
			})
			admin.socket.on('failedLog', function(){
				$scope.$apply(function() { $rootScope.showAlert = true, $rootScope.alertMsg = "Identifiants incorrects", $rootScope.alertType='danger'});
				$timeout(function() {
		   			 $scope.$apply(function() {$rootScope.showAlert = false});
		   		}, 3000)
			})
			/*if(admin.logPass == "jetaimemonamour"){
			}else{
			}*/
		}
		admin.add = function(){
			let projectInfo = {
				"id": 1,
				"title": admin.title,
				"text": admin.text,
				"type": admin.type,
				"tag": admin.tag,
				"customerType" : admin.customerType,
				"customer" : admin.customer,
				"date" : admin.date,
				"thumb": admin.thumb,
				"image": admin.image
			}
           	admin.socket.emit('addProject', projectInfo);
           	admin.socket.on('projectAdded', function (data) {
           	    $rootScope.projectList = data; 
           		 $scope.$apply(function() { $rootScope.showAlert = true, $rootScope.alertMsg = "projet ajouté avec succès", $rootScope.alertType='success'});
           		 $timeout(function() {
		   			 $scope.$apply(function() {$rootScope.showAlert = false});
		   		}, 3000)


		    });
		}
		admin.changeBlock = function(block,title){
			if(admin.showedBlock != "log"){
				admin.showedBlock = block;
				admin.h1Value = title;
			}
		}
		admin.showPickedProject = function(project){
			AdminService.setPickedProject(project)
			admin.picked = project
			$rootScope.interPicked = true;
			$location.hash('pickedProject');
	        anchorSmoothScroll.scrollTo('pickedProject');
	        $scope.$broadcast('reloadSql');
		}

	};
	adminCtrl.$inject = ['AdminService','$anchorScroll','$location','anchorSmoothScroll','$rootScope','$scope','$timeout'];

})();
