(function(){

	'use strict';
	angular
	.module('pucheApp')
	.controller('adminCtrl', adminCtrl);

	function adminCtrl(AdminService,$anchorScroll,$location,anchorSmoothScroll,$rootScope,$scope){
		const admin = this;
		admin.h1Value = "Ajouter un projet";
		admin.showedBlock = "add";
		$rootScope.interPicked = false;
		admin.picked = {}
		admin.socket = io.connect('/');
		admin.socket.on('onProjectList', function (data) {
            $rootScope.projectList = data;
        });

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
			console.log(projectInfo.thumb);
           	admin.socket.emit('addProject', projectInfo);
           	admin.socket.on('projectAdded', function (data) {
           	    $rootScope.projectList = data; 
           		alert("projet ajouté avec succès");

		    });
		}
		admin.changeBlock = function(block,title){
			admin.showedBlock = block;
			admin.h1Value = title;
		}
		admin.showPickedProject = function(project){
			AdminService.setPickedProject(project)
			admin.picked = project
			$rootScope.interPicked = true;
			$location.hash('pickedProject');
	        anchorSmoothScroll.scrollTo('pickedProject');
	        $scope.$broadcast('someEvent');
		}

	};
	adminCtrl.$inject = ['AdminService','$anchorScroll','$location','anchorSmoothScroll','$rootScope','$scope'];

})();
