
(function(){

  'use strict';
	angular
    .module('pucheApp')
    .service('PucheService', PucheService)
    .service('AdminService', AdminService)

    function PucheService($http,$q){
        this.pickedProject

        this.setPickedProject = function(project) {
          var deferred = $q.defer();
          this.pickedProject = project
          deferred.resolve(this.pickedProject);
          return deferred.promise;
        };

        this.getPickedProject = function(){
          var deferred = $q.defer();
          deferred.resolve(this.pickedProject);
          return deferred.promise;
        };
    }
    function AdminService($http,$q){
          this.pickedProject

          this.setPickedProject = function(project) {
            var deferred = $q.defer();
            this.pickedProject = project
            deferred.resolve(this.pickedProject);
            return deferred.promise;
          };

          this.getPickedProject = function(){
            var deferred = $q.defer();
            deferred.resolve(this.pickedProject);
            return deferred.promise;
          };
    }

   PucheService.$inject = ['$http','$q']
   AdminService.$inject = ['$http','$q']

})();
