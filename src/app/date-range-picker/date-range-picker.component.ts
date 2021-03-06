import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.css']
})
export class DateRangePickerComponent implements OnInit {

  public date = moment();
  public daysArray;
  public dateFrom;
  public dateTo;
  public dateConsidered;
  public currentDate = moment();
  @Output() filterWasApplied = new EventEmitter();

  constructor() { }

  public ngOnInit() {
    this.daysArray = this.createCalendar(this.date);
  }

  public createCalendar(month) {
    let firstDay = moment(month).startOf('M');
    let days = Array.apply(null, { length: month.daysInMonth() })
      .map(Number.call, Number)
      .map(n => {
        return moment(firstDay).add(n, 'd');
      });
    for (let n = 0; n < firstDay.weekday(); n++) {
      days.unshift(null);
    }
    return days;

  }

  public todayCheck(day) {
    if (!day) {
      return false;
    }
    return moment().format('L') === day.format('L');
  }

  public nextMonth() {
    this.date.add(1, 'M');
    this.daysArray = this.createCalendar(this.date);
  }


  public previousMonth() {
    this.date.subtract(1, 'M');
    this.daysArray = this.createCalendar(this.date);

  }

  public selectedDate(day) {
    if (!day || this.isDayInthePast(day)) {
      return;
    }
    let dayFormatted = day.format('MM/DD/YYYY');

    if (this.isFormValid()) {
      this.dateTo = null;
      this.dateFrom = null;
      this.filterWasApplied.emit(false);
      
      console.log("date from: " + this.dateFrom);
      console.log("date to: " + this.dateTo);
      return;
    }
    if (this.dateFrom == null) {
      this.dateFrom = dayFormatted;
      this.filterWasApplied.emit(true);

    }
    else {
      this.dateTo = dayFormatted;
    }
    console.log("date from: " + this.dateFrom);
    console.log("date to: " + this.dateTo);

  }

  public isFormValid() {
    if (this.dateFrom != null && this.dateTo != null) {
      return true;
    }
    return false;
  }

  public isSelected(day) {
    let dateFrom = moment(this.dateFrom, 'MM/DD/YYYY');
    let dateTo = moment(this.dateTo, 'MM/DD/YYYY');
    if (!day) {
      return false;
    }
    if (this.isFormValid()) {
      return dateFrom.isSameOrBefore(day) && dateTo.isSameOrAfter(day);
    }
    if (this.dateFrom != null) {
      return dateFrom.isSame(day);
    }
  }

  isConsidered(day) {
    let dateFrom = moment(this.dateFrom, 'MM/DD/YYYY');
    let dateTo = moment(this.dateTo, 'MM/DD/YYYY');
    let dateConsidered = moment(this.dateConsidered, 'MM/DD/YYYY');

    if (!day || this.isFormValid()) {
      return false;
    }
    if (this.dateFrom == null) {
      return false;
    }
    else {
      return dateFrom.isSameOrBefore(day) && dateConsidered.isSameOrAfter(day);
    }
  }

  getDateMousedOver(day) {
    if (!day || this.isDayInthePast(day)) {
      return false;
    }
    let dayFormatted = day.format('MM/DD/YYYY');
    this.dateConsidered = dayFormatted;
    return day;
  }

  isDayInthePast(day) {
    if (day.isBefore(this.currentDate, 'day')) {
      return true;
    }
    return false;
  }


}
