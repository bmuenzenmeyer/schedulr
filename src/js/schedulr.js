var app = angular.module('schedulr', ['ui.sortable']);

app.controller('SchedulrCtrl', function($scope) {

  $scope.weekStart = undefined;
  $scope.scheduleInterval = 7;
  $scope.days = [];
  $scope.shiftBuilderName = '';
  $scope.shiftBuilderStart = '';
  $scope.shiftBuilderEnd = '';
  $scope.shiftBuilderDesc = '';
  $scope.unScheduledShifts = [];
  $scope.employees = {};
  $scope.hourError = false;

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

  function getShiftLength(start, end){

    var safeStart = parseInt(start, 0);
    var safeEnd = parseInt(end, 0);

    var shiftLength = 0;
    var additionalHours = 0;
    if(!isNaN(safeStart) && !isNaN(safeEnd)){
      $scope.hourError = false;
      if(safeStart > safeEnd){
        additionalHours = 12 - safeStart;
        shiftLength = additionalHours + safeEnd;
      } else if(safeStart < safeEnd){
        shiftLength = safeEnd - safeStart;
      } else{
        shiftLength = 12;
      }
    } else{
      //add notifcation to client
      $scope.hourError = true;
    }
    return shiftLength;
  }

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

    var shiftLength = getShiftLength($scope.shiftBuilderStart, $scope.shiftBuilderEnd);

    if($scope.hourError){
      return;
    }
    $scope.unScheduledShifts.push({
      empName : $scope.shiftBuilderName,
      start: $scope.shiftBuilderStart,
      end: $scope.shiftBuilderEnd,
      desc: $scope.shiftBuilderDesc,
      editing: false,
      shiftLength: shiftLength
    });

    if($scope.employees[$scope.shiftBuilderName]){
      $scope.employees[$scope.shiftBuilderName].totalHours += shiftLength;
    } else{
      $scope.employees[$scope.shiftBuilderName] = {totalHours: shiftLength};
    }

    $scope.shiftBuilderName = '';
    $scope.shiftBuilderStart = '';
    $scope.shiftBuilderEnd = '';
    $scope.shiftBuilderDesc = '';

  };

  $scope.saveShift = function(shift, day){

    //todo - recalculate hours
    shift.editing = false;
  };

  $scope.deleteShift = function(shift, day){
    var confirmDelete = confirm('Are you sure you want to delete this shift? Click Ok to delete.');
    if(!confirmDelete){
      return;
    }
    var d = $scope.days[$scope.days.indexOf(day)];

    //remove shiftLength from employee
    $scope.employees[shift.empName].totalHours -= shift.shiftLength;

    shift.editing = false;
    d.shifts.splice(d.shifts.indexOf(shift),1);
  };

  $scope.editShift = function(shift){
    shift.editing = true;
  };

  $scope.doneEditing = function(shift){
    shift.editing = false;
  };

  // //quicker debugging
  //   $scope.shiftBuilderName = 'Megan';
  //   $scope.shiftBuilderStart = '9';
  //   $scope.shiftBuilderEnd = '5';
  //   $scope.shiftBuilderDesc = 'Cooking';

});