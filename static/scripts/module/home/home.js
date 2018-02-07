(function(){

	'use strict';
	angular
	.module('pucheApp')
	.controller('homeCtrl', homeCtrl);

	function homeCtrl(PucheService,$anchorScroll,$location,anchorSmoothScroll,$rootScope,$uibModal,$animate,$timeout){
		const home = this;
		$rootScope.interPicked = false;
		$rootScope.projectList = {};
		home.animateGalery = 0
		home.picked = {}
		home.socket = io.connect('/');
        home.socket.on('onProjectList', function (data) {
            $rootScope.projectList = data;
		   	home.pickedList = $rootScope.projectList
		   	home.animateGalery = 1
		   	$timeout(function() {
		   		home.animateGalery = 0
		   	}, 800)
        });
        home.openModal = function(size){
        	home.modalInstance = $uibModal.open({
		      animation: true,
		      ariaLabelledBy: 'modal-title',
		      ariaDescribedBy: 'modal-body',
		      templateUrl: '/scripts/module/home/modal.html',
		      controller:function($uibModalInstance ,$scope){
			     $scope.close = function () {
			            $uibModalInstance.dismiss('cancel');
			         };
			  },
		      size: size,
		    })
        }
		home.showPickedProject = function(project){
			$rootScope.animateProject = 0;
			PucheService.setPickedProject(project)
			home.picked= project
			$rootScope.interPicked = true;
			$location.hash('pickedProject');
	        anchorSmoothScroll.scrollTo('pickedProject');
		}
		home.changeList = function(filter){
			home.animateGalery = 1
			$timeout(function() {
				home.pickedList=[];
				if (filter == 'tout'){
						home.pickedList = $rootScope.projectList;
					
				}else{
					// application de la fonction de filtrage par propriété des objets
						home.pickedList = home.pickList($rootScope.projectList,filter);
				}
				home.animateGalery = 0
			}, 800)
			
		}
		home.pickList = function(obj,type) {
			//creation d'un tableau qui contiendra la liste de resultat
            var result = [];
            // boucle dans la liste d'objet pour verifier chaque projet
            for (var prop in obj) {
            	//boucle dans chaque objet pour verifier chaque propriété 
                for (var prop2 in obj[prop]) {
                	// si la valeur de la propriete de l'objet verifier est
                	// egale au type voulu alors on ajoute l'objet a la liste de resultat
                	if(typeof obj[prop][prop2] == "string"){
	                	var arrType = obj[prop][prop2].split(",");
		                if(arrType.includes(type)){
		                    result.push(obj[prop]);
		                }
                	}
	            }
            }
            return result;

        }


	};

	homeCtrl.$inject = ['PucheService','$anchorScroll','$location','anchorSmoothScroll','$rootScope','$uibModal','$animate','$timeout'];

})();
