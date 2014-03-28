var app = angular.module('schedulr', ['ui.sortable']);

app.controller('SchedulrCtrl', function($scope) {

  $scope.weekStart = undefined;
  $scope.scheduleInterval = 7;
  $scope.days = [];
  $scope.shiftBuilderName = '';
  $scope.shiftBuilderStart = '';
  $scope.shiftBuilderEnd = '';
  $scope.unScheduledShifts = [];
  $scope.shifts = [];

  $scope.$watch('weekStart', function(newValue, oldValue){
    if(newValue !== oldValue){
      $scope.weekStart = newValue;
      $scope.buildDays();
    }

  });

    $scope.$watch('scheduleInterval', function(newValue, oldValue){
    if(newValue !== oldValue){
      $scope.scheduleInterval = newValue;
      $scope.buildDays();
    }

  });

  $scope.sortableOptions = {
    connectWith: ".shiftList"
  };

  $scope.buildDays = function(){
    $scope.days.length = 0;
    var m = moment($scope.weekStart);
    for(var i=0; i < $scope.scheduleInterval; i++){
      var d = m;
      $scope.days[i] = {
        date: d,
        mDate: d.format("MMM D"),
        dayOfWeek: d.format("dddd"),
        dId: 'dId'+ d.format("MMDD"),
        shifts: []
      };
      m.add('days', 1);
    }
  };

  $scope.addShift = function(){
    $scope.unScheduledShifts.push({
      empName : $scope.shiftBuilderName,
      start: $scope.shiftBuilderStart,
      end: $scope.shiftBuilderEnd
    });

    $scope.shiftBuilderName = '';
    $scope.shiftBuilderStart = '';
    $scope.shiftBuilderEnd = '';

    $scope.initSortable();

  };
 
  // $scope.remaining = function() {
  //   var count = 0;
  //   angular.forEach($scope.todos, function(todo) {
  //     count += todo.done ? 0 : 1;
  //   });
  //   return count;
  // };

});