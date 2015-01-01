var resolve = function(file) {
  return __dirname + '/' + file + '.js';
};

module.exports = 
  {
    files: [
      resolve('lib'),
      resolve('app')
    ]
  }