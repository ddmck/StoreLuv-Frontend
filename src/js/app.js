var app = angular.module('App', ['ui.router', 'infinite-scroll']);

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

app.factory('Filters', function(){
  return {};
});

app.factory('Products', ['$http', 'Filters', function($http, Filters){
  var products = [];
  return {
    getProducts: function(){
      return products;
    },
    resetProducts: function(){
      products = [];
    },
    addProducts: function(newProducts){
      products = products.concat(newProducts);
    },
    fetchProducts: function(){
      $http.get('http://localhost:3000/products.json', {params: {page: "1", gender: Filters.gender}}).success(function(data){
        products = products.concat(data);
        scrollActive = true;
      });
    }
  };
}]);

app.controller('ProductsController',  ['$http', 'Filters', 'Products', function($http, Filters, Products){
  this.scrollActive = false;
  var scrollActive = this.scrollActive;
  var productCtrl = this;
  productCtrl.products = Products;

  this.filters = Filters;
  var currentPage = 1;

  $http.get('http://localhost:3000/products.json', {params: {page: currentPage.toString(), filters: JSON.stringify(this.filters)}}).success(function(data){
    productCtrl.products.addProducts(data);
    scrollActive = true;
  });

  this.openLink = function(product){
    window.open(product.url,'_blank');
  };

  this.nextPage = function(products){
    if (scrollActive === true) {
      scrollActive = false;
      currentPage += 1;
      
      $http.get('http://localhost:3000/products.json', {params: {page: currentPage.toString(), gender: this.filters.gender}}).success(function(data){
        productCtrl.products.addProducts(data);
        scrollActive = true;
      });
    }
  };
}]);

app.controller('SubNavController', ['Filters', 'Products', function(Filters, Products){
  this.setGender = function(gender) {
    if ( gender === "mens") {
      Filters.gender = "male";
    } else if ( gender === "womens") {
      Filters.gender = "female";
    }
    Products.resetProducts();
    Products.fetchProducts();
  };
}]);