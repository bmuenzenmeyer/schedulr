var app = angular.module('schedulr', ['ui.sortable']);

app.controller('SchedulrCtrl', function($scope) {

  $scope.scheduleInterval = 7;
  $scope.days = [];
  $scope.shiftBuilderName = '';
  $scope.shiftBuilderStart = '';
  $scope.shiftBuilderEnd = '';
  $scope.shiftBuilderDesc = '';
  $scope.unscheduledShifts = [];
  $scope.employees = [];
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
    connectWith: ".shiftList",
    update: function(){
      calculateHourTotals();
    }
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

  //this doesn't feel very angular
  function calculateHourTotals(){
    $scope.employees = [];
    for(var i=0; i < $scope.days.length; i++){
      for(var j=0; j < $scope.days[i].shifts.length; j++){

        var shiftLength = getShiftLength($scope.days[i].shifts[j].start, $scope.days[i].shifts[j].end);
        var name = $scope.days[i].shifts[j].name;
        var isEmployee = false;

        for(var k = 0; k < $scope.employees.length; k++){
          if($scope.employees[k].name === name){
            $scope.employees[k].totalHours += shiftLength;
            isEmployee = true;
          }
        }

        if(!isEmployee){
          $scope.employees.push({
            name: name,
            totalHours: shiftLength
          });
        }
      }
    }
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
    $scope.unscheduledShifts.push({
      name : $scope.shiftBuilderName,
      start: $scope.shiftBuilderStart,
      end: $scope.shiftBuilderEnd,
      desc: $scope.shiftBuilderDesc,
      editing: false,
      shiftLength: shiftLength
    });

    $scope.shiftBuilderName = '';
    $scope.shiftBuilderStart = '';
    $scope.shiftBuilderEnd = '';
    $scope.shiftBuilderDesc = '';

    calculateHourTotals();

  };

  $scope.saveShift = function(shift, day){
    calculateHourTotals();
    shift.editing = false;
  };

  $scope.deleteShift = function(shift, day){
    var confirmDelete = confirm('Are you sure you want to delete this shift? Click Ok to delete.');
    if(!confirmDelete){
      return;
    }
    var d = $scope.days[$scope.days.indexOf(day)];
    d.shifts.splice(d.shifts.indexOf(shift),1);
    shift.editing = false;
    calculateHourTotals();

  };

  $scope.deleteEmployee = function(){

  };

  $scope.editShift = function(shift){
    shift.editing = true;
  };

  $scope.doneEditing = function(shift){
    shift.editing = false;
  };

  //quicker debugging
  $scope.shiftBuilderName = 'Megan';
  $scope.shiftBuilderStart = '9';
  $scope.shiftBuilderEnd = '5';
  $scope.shiftBuilderDesc = 'Cooking';

});