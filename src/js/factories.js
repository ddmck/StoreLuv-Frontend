var factories = angular.module('factories', ['ngRoute']);

factories.factory('Filters',['$location', function($location){
  var filters = {};
  return {
    getFilters: function(){
      return filters;
    },
    setFilter: function(name, value){
      filters[name] = value;
      $location.search(name, value);
    },
    removeFilter: function(name){
      delete filters[name];
      $location.search(name, null);
    },
    setMultipleFilters: function(hash){
      filters = hash;
    },
    resetAll: function(){
      filters = {};
    }           
  };
}]);

