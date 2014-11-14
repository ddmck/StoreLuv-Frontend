var app = angular.module('App', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    
  $urlRouterProvider.otherwise('/home');
  
  $stateProvider
      
    // HOME STATES AND NESTED VIEWS ========================================
    .state('home', {
        url: '/home',
        templateUrl: 'partials/partial-home.html'
    })
    
    // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
    .state('about', {
        // we'll get to this in a bit       
    });
  

});

app.controller('ProductsController', ['$http', function($http){

  var productCtrl = this;
  productCtrl.products = [];

  $http.get('http://localhost:3000/products.json', {params: {page: 10}}).success(function(data){
    productCtrl.products = data;
  });

  this.openLink = function(product){
    window.open(product.url,'_blank');
  };
}]);