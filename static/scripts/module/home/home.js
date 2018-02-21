(function(){

	'use strict';
	angular
	.module('pucheApp')
	.controller('homeCtrl', homeCtrl);

	function homeCtrl(PucheService,$anchorScroll,$location,anchorSmoothScroll,$rootScope,$uibModal,$animate,$timeout,$scope,$window){
		const home = this;
		$rootScope.interPicked = false;
		$rootScope.projectList = {};
		home.animateGalery = 0
		home.picked = {}
		angular.element($window).bind("scroll", function() {
			var element = angular.element(document.querySelector('#galery')); 
			var height = element[0].offsetHeight;
             if ($window.scrollY - height >= 550 && $rootScope.interPicked) {
             	home.showTopBtn = true
             } else {
             	home.showTopBtn = false
             }
            $scope.$apply();
        });
       
        angular.element($window).bind('resize', function(){
           home.setGaleryClass()
       });   
		home.socket = io.connect('/');
		// Récuperation des projet depuis la base.
        home.socket.on('onProjectList', function (data) {
		   	home.setGaleryClass()
		   	home.animateGalery = 1
		   	$timeout(function() {
	            $rootScope.projectList = data;
			    $rootScope.pickedList = home.pickFullList($rootScope.projectList);
		   		home.animateGalery = 0
		   	}, 800)
        });
        // parametrage de la vue en fonction de la largeur de l'ecran
        home.setGaleryClass = function(){
			var elementW = angular.element(document.querySelector('#galery')); 
			var width = elementW[0].offsetWidth;
			if(width >1380){
				home.responsiveClass = 1;
			}else if(width<1080){
				home.responsiveClass = 2;
			}else{
				home.responsiveClass = 3;
			}
        }
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
        // action au click tu bouton retour en haut
        home.goToProjectTop = function(){
	        anchorSmoothScroll.scrollTo('pickedProject');
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
			$rootScope.interPicked = false;
			home.animateGalery = 1
			$timeout(function() {
				home.pickedList=[];
				if (filter == 'tout'){
						$rootScope.pickedList = home.pickFullList($rootScope.projectList);
					
				}else{
					// application de la fonction de filtrage par propriété des objets
						$rootScope.pickedList = home.pickList($rootScope.projectList,filter);
				}
				home.animateGalery = 0
			}, 800)
			
		}
		home.pickFullList = function(obj) {
			//creation d'un tableau qui contiendra la liste de resultat
            var result = [];
            // boucle dans la liste d'objet pour verifier chaque projet
            for (var prop in obj) {
		        result.push(obj[prop]);
            }
            result = home.shuffleArray(result);
            console.log(result)
            return result;

        }
		home.pickList = function(obj,type) {
			console.log("heyho")
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
            result = home.shuffleArray(result);
            return result;

        }
        home.shuffleArray = function(array) {
		    for (let i = array.length - 1; i > 0; i--) {
		        let j = Math.floor(Math.random() * (i + 1));
		        [array[i], array[j]] = [array[j], array[i]];
		    }
			return array
		}

	};

	homeCtrl.$inject = ['PucheService','$anchorScroll','$location','anchorSmoothScroll','$rootScope','$uibModal','$animate','$timeout','$scope','$window'];

})();
