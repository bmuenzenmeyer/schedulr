function WeekCtrl($scope) {

  $scope.weekStart = undefined;
  $scope.scheduleInterval = 7;
  $scope.days = [];

  $scope.$watch('weekStart', function(newValue, oldValue){
    if(newValue !== oldValue){
      $scope.weekStart = newValue;
      $scope.buildDays();

      // jQuery( "#dayList1, #dayList2" ).sortable({
      //   connectWith: ".connectedSortable"
      // }).disableSelection();

    }

  });

    $scope.$watch('scheduleInterval', function(newValue, oldValue){
    if(newValue !== oldValue){
      $scope.scheduleInterval = newValue;
      $scope.buildDays();
    }

  });

  $scope.buildDays = function(){
    $scope.days.length = 0;
    var m = moment($scope.weekStart);
    for(var i=0; i < $scope.scheduleInterval; i++){
      var d = m;
      $scope.days[i] = {
        date: d,
        mDate: d.format("MMM D"),
        dayOfWeek: d.format("dddd"),
        dId: 'dayList'+i
      };
      m.add('days', 1);
    }
  };
 
  // $scope.remaining = function() {
  //   var count = 0;
  //   angular.forEach($scope.todos, function(todo) {
  //     count += todo.done ? 0 : 1;
  //   });
  //   return count;
  // };
}