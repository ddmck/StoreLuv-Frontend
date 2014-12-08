var expect = chai.expect;

describe("Filters", function(){

  beforeEach(module('factories'));

  var Filters;
  var $location;

  beforeEach(inject(function(_Filters_, _$location_){
    Filters = _Filters_;
    $location = _$location_;
  }));

  afterEach((function(){
    Filters.resetAll();
  }));

  it('should initially return an empty hash', function(){
    // Arrange
    var result;
    // Act
    result = Filters.getFilters();
    // Assert
    expect(result).to.deep.equal({});
  });

  it('should set a filter', function(){
    // Arrange

    // Act
    Filters.setFilter('gender', 'male');
    // Assert
    expect(Filters.getFilters()).to.eql({gender: 'male'})
    expect(Filters.getFilters().gender).to.equal('male')
  });

  it('should be able to handle bulk assignment', function(){
    // Arrange
    var hash = {gender: 'male', category_id: 1, searchString: "Boo"};
    // Act
    Filters.setMultipleFilters(hash)
    // Assert
    expect(Filters.getFilters()).to.eql(hash);
  });

  it('should remove a filter', function(){
    // Arrange
    Filters.setFilter('gender', 'male');
    expect(Filters.getFilters()).to.eql({gender: 'male'});
    // Act
    Filters.removeFilter('gender');
    // Assert
    expect(Filters.getFilters()).to.eql({});
  });

  it('should be able to reset all Filters', function(){
    // Arrange
    var hash = {gender: 'male', category_id: 1, searchString: "Boo"};
    Filters.setMultipleFilters(hash);
    expect(Filters.getFilters()).to.eql(hash);
    // Act
    Filters.resetAll();
    // Assert 
    expect(Filters.getFilters()).to.eql({});
  });
});

