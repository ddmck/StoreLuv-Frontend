var expect = chai.expect;

describe("Filters", function(){

  beforeEach(module('factories'));

  var Filters;
  var $location;

  beforeEach(inject(function(_Filters_, _$location_){
    Filters = _Filters_;
    $location = _$location_;
  }));

  it('should initially return an empty hash', function(){
    // Arrange
    var result;
    // Act
    var result = Filters.getFilters();
    // Assert
    expect(Filters.getFilters()).to.be.empty();
  });
});

