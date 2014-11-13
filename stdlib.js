var resolve = function(file) {
  return __dirname + '/src/js/lib/' + file + '.js';
};

module.exports = 
  {
    files: [
      resolve('angular.min'),
      resolve('angular-ui-router.min'),
      resolve('fastclick'),
      resolve('jquery'),
      resolve('jquery.cookie'),
      resolve('modernizr'),
      resolve('foundation.min'),
      resolve('placeholder')
    ]
  }