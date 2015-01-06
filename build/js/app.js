var app = angular.module('App', ['infinite-scroll', 'ngSanitize', 'ngRoute', 'ng-token-auth', 'ipCookie'])

app.config(function($routeProvider, $locationProvider) {
  // $locationProvider.hashPrefix('!');
  $locationProvider.html5Mode({ enabled: true});
  // $location.path('/');
});

app.factory('Filters', ['$location', function($location){
  // Hacky way to prevent location being set to empty string causing refresh
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
      if (_.isEmpty(filters)) {
        $location.url($location.path())
      } else {
        $location.search(name, null);
      }
    },
    useQuery: function(query){
      filters = query;
      if (_.isEmpty(filters)) {
        $location.url($location.path())
      } else {
        $location.search(filters);
      }
    },
    resetAll: function(){
      filters = {};
      $location.url($location.path())
    }         
  };
}]);

app.factory('Categories', [ '$http', function($http){
  var categories = [];
  return {
    fetchCategories: function(){
      $http.get('categories.json').success(function(data){
        categories = data;
      });
    },
    list: function(){
      return categories;
    }
  }
}]);

app.factory('SubCategories', [ '$http', function($http){
  var subCategories = [];
  return {
    fetchSubCategories: function(){
      $http.get('sub_categories.json').success(function(data){
        subCategories = data;
      });
    },
    list: function(){
      return subCategories;
    }
  }
}]);

app.factory('WishlistItems', [ '$http', function($http){
  var wishlistItems = [];
  return {
    fetchWishlistItems: function(){
      $http.get('wishlist_items.json').success(function(data){
        wishlistItems = data;
        console.table(wishlistItems)
      });
    },
    list: function(){
      return wishlistItems;
    }
  }
}]);

app.factory('Products', ['$http', 'Filters', '$location', function($http, Filters, $location){
  var query = $location.search();
  Filters.useQuery(query);
  var factory = this;
  var products = [];
  var page = 1;
  var searching = true;
  return {
    getProducts: function(){
      return products;
    },
    currentPage: function(){
      return page;
    },
    currentlySearching: function(){
      return searching;
    },
    enumeratePage: function(){
      page += 1;
    },
    resetProducts: function(){
      products = [];
    },
    resetPage: function(){
      page = 1;
    },
    addProducts: function(newProducts){
      products = products.concat(newProducts);
    },
    fetchProducts: function(){
      searching = true;
      $http.get('products.json', {async: true, params: {page: page.toString(), gender: Filters.getFilters().gender, category: Filters.getFilters().category, sub_category: Filters.getFilters().subCategory, search_string: Filters.getFilters().searchString}}).success(function(data){
        products = products.concat(data);
        scrollActive = true;
        searching = false;
      });
    }
  };
}]);

app.controller('UserSessionsController', ['$scope', function ($scope) {
  console.log("Hey from users controller");
  $scope.$on('auth:login-error', function(ev, reason) { 
    $scope.error = reason.errors[0]; 
  });

  $scope.$on('auth:login-success', function(ev){
    $('#signInModal').foundation('reveal', 'close');
  });
  $scope.handleLoginBtnClick = function() {
    $auth.submitLogin($scope.loginForm)
      .then(function(resp) {

      })
      .catch(function(resp) { 
        // handle error response
      });
  };
}]);

app.controller('UserRegistrationsController', ['$scope', '$auth', function($scope, $auth) {
  $scope.$on('auth:registration-email-success', function(ev, message){
    $('#signUpModal').foundation('reveal', 'close');
    console.log(message);
    $auth.submitLogin({
      email: $scope.registrationForm.email,
      password: $scope.registrationForm.password
    });
  });

  $scope.handleRegBtnClick = function() {
    $auth.submitRegistration($scope.registrationForm)
      .then(function(resp) { 
        
      })
      .catch(function(resp) { 
        
      });
    };
}]);


app.controller('ProductsController',  ['$http', 'Filters', 'Products', 'WishlistItems', function($http, Filters, Products, WishlistItems){
  this.scrollActive = false;
  var scrollActive = this.scrollActive;
  var productCtrl = this;
  productCtrl.products = Products;
  WishlistItems.fetchWishlistItems();

  this.filters = Filters;
  
  // Products.fetchProducts();

  $http.get('products.json', {params: { 
                                page: Products.currentPage().toString(), 
                                gender: this.filters.getFilters().gender, 
                                category: this.filters.getFilters().category,
                                sub_category: this.filters.getFilters().subCategory, 
                                search_string: this.filters.getFilters().searchString}
                              }).success(function(data){
    productCtrl.products.addProducts(data);
    scrollActive = true;
  });

  this.wishFor = function(product, userId){
    if (!userId) {
      $('#signInModal').foundation('reveal', 'open');
    } else if (_.some(WishlistItems.list(), { 'product_id': product.id })){
       index = _.findIndex(WishlistItems.list(), { 'product_id': product.id })
       wishlistItem = WishlistItems.list()[index]
       $http.delete('wishlist_items/' + wishlistItem.id + '.json', {
       } ).success(function(data){
        WishlistItems.fetchWishlistItems();
       });
    } else {
      $http.post('wishlist_items.json', {wishlist_item: {
        product_id: product.id
      }} ).success(function(data){
        WishlistItems.fetchWishlistItems();
      });  
    }
    
  }; 

  this.checkIfWishedFor = function(product_id){
    return _.some(WishlistItems.list(), { 'product_id': product_id });
  },                           


  this.openLink = function(product, userId){

    window.open(product.url,'_blank');
    if (!userId) {
      $('#signUpModal').foundation('reveal', 'open');
    }
  };

  this.nextPage = function(products){
    if (scrollActive === true) {
      scrollActive = false;
      Products.enumeratePage();
      
      $http.get('products.json', {async: true, params: {page: Products.currentPage().toString(), gender: this.filters.getFilters().gender, category: this.filters.getFilters().category, sub_category: Filters.getFilters().subCategory, search_string: Filters.getFilters().searchString}}).success(function(data){
        productCtrl.products.addProducts(data);
        scrollActive = true;
      });
    }
  };
}]);

app.controller('GenderController', ['Filters', 'Products', function(Filters, Products){
  this.setGender = function(gender) {
    if ( gender === "mens") {
      Filters.setFilter("gender", "male");
    } else if ( gender === "womens") {
      Filters.setFilter("gender", "female");
    } else if ( gender === "" ){
      Filters.removeFilter("gender")
    }
    Products.resetProducts();
    Products.resetPage()
    Products.fetchProducts();
  };
}]);

app.controller('CategoryController', ['Filters', 'Products', 'Categories', function(Filters, Products, Categories){
  var categoryCtrl = this;
  categoryCtrl.categories = [];
  Categories.fetchCategories();
  categoryCtrl.categories = Categories;
  this.filters = Filters;

  this.setCategory = function(cat_id){
    if (cat_id === "") {
      Filters.removeFilter("category");
    } else {
      Filters.setFilter("category", parseInt(cat_id));
    }
    Filters.removeFilter("subCategory");
    Products.resetProducts();
    Products.resetPage();
    Products.fetchProducts();
  };
}]);

app.controller('SubCategoryController', ['Filters', 'Products', 'Categories', 'SubCategories', function(Filters, Products, Categories, SubCategories){
  var subCatCtrl = this;
  subCatCtrl.subCategories = [];
  SubCategories.fetchSubCategories();
  subCatCtrl.subCategories = SubCategories;
  this.filters = Filters;

  this.setSubCat = function(sub_cat_id){
    if (sub_cat_id === "") {
      Filters.removeFilter("subCategory");
    } else {
      Filters.setFilter("subCategory", parseInt(sub_cat_id));
    }
    Products.resetProducts();
    Products.resetPage();
    Products.fetchProducts();
  };
}]);

app.controller('SearchController', ['Filters', 'Products', 'Categories', function(Filters, Products, Categories){
  this.updateSearch = function(searchString){
    if (searchString === null || searchString === undefined || searchString === '' || searchString === ' ') {
      return
    } else {
      Filters.setFilter("searchString", searchString);
      Products.resetProducts();
      Products.resetPage();
      Products.fetchProducts();
    }
  }

  this.findCat = function(searchString){
    Filters.removeFilter("category");
    Filters.removeFilter("subCategory");
    var words = searchString.toLowerCase().split(" ");
    _(words).forEach(function(word){
      if (Filters.getFilters().category === undefined) {
        _(Categories.list()).forEach(function(category){
          if (Filters.getFilters().category === undefined) {
            if (category.name === word){
              Filters.setFilter("category", parseInt(category.id));
            } else if (category.name.substring(0, category.name.length - 1) === word) {
              Filters.setFilter("category", parseInt(category.id));
            }
          }
        });
      }
    });
    
  };

}]);

$(document).ready(function(){
  $('.feature-buy-button').click(function(){
    if (!$("#sign-in-li").hasClass("ng-hide")) {
      $('#signUpModal').foundation('reveal', 'open');
    }
  });
});
