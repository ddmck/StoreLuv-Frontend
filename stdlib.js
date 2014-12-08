var resolve = function(file) {
  return __dirname + '/src/js/lib/' + file + '.js';
};

module.exports = 
  {
    files: [
      resolve('jquery'),
      resolve('jquery.cookie'),
      resolve('angular'),
      resolve('angular-route'),
      resolve('angular-sanitize'),
      resolve('fastclick'),
      resolve('modernizr'),
      resolve('foundation.min'),
      resolve('placeholder'),
      resolve('ng-infinite-scroll'),
      resolve('lodash.min'),
      resolve('inflection.min'),
      resolve('google-analytics')
    ]
  }