var app = angular.module('App', ['infinite-scroll'])

app.factory('Filters', function(){
  return {};
});

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

app.factory('Products', ['$http', 'Filters', function($http, Filters){
  var products = [];
  var page = 1;
  return {
    getProducts: function(){
      return products;
    },
    currentPage: function(){
      return page;
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
      $http.get('products.json', {params: {page: page.toString(), gender: Filters.gender, category: Filters.category, search_string: Filters.searchString}}).success(function(data){
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
  

  $http.get('products.json', {params: { 
                                                              page: Products.currentPage().toString(), 
                                                              gender: this.filters.gender, 
                                                              category: this.filters.category, 
                                                              search_string: Filters.searchString}
                                                            }).success(function(data){
    productCtrl.products.addProducts(data);
    scrollActive = true;
  });

  this.openLink = function(product){
    window.open(product.url,'_blank');
  };

  this.nextPage = function(products){
    if (scrollActive === true) {
      scrollActive = false;
      Products.enumeratePage();
      
      $http.get('products.json', {params: {page: Products.currentPage().toString(), gender: this.filters.gender, category: this.filters.category, search_string: Filters.searchString}}).success(function(data){
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

app.controller('CategoryController', ['Filters', 'Products', 'Categories', function(Filters, Products, Categories){
  var categoryCtrl = this;
  categoryCtrl.categories = [];
  Categories.fetchCategories();
  categoryCtrl.categories = Categories;

  this.setCategory = function(cat_id){
    Filters.category = cat_id;
    Products.resetProducts();
    Products.resetPage();
    Products.fetchProducts();
  };
}]);

app.controller('SearchController', ['Filters', 'Products', 'Categories', function(Filters, Products, Categories){
  this.updateSearch = function(searchString){
    console.log(searchString);
    Filters.searchString = searchString;
    Products.resetProducts();
    Products.resetPage();
    Products.fetchProducts();  
  }

  this.findCat = function(searchString){
    Filters.category = null;
    var words = searchString.toLowerCase().split(" ");
    _(words).forEach(function(word){
      _(Categories.list()).forEach(function(category){
        if (category.name === word){
          Filters.category = category.id;
        }
      });
    });
    console.log(Filters);
  };

}]);




