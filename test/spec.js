var expect = chai.expect;

describe("Filters", function(){

  beforeEach(module('App'));

  var filters;

  beforeEach(inject(function(_filters_){
    filters = _filters_;
  }));

  it('should initially return an empty hash', function(){
    // Arrange
    // var result;
    // Act
    // var result = filters.getFilters();
    // Assert
    // var expected = {};
    expect(true).to.equal(true);
  });
});

