import { Component, OnInit } from '@angular/core';
import { DoctorService } from './doctor.service';
import { Doctor } from './doctor';
import BASE_CONFIG from '../config/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Sharp Code Challenge';
  sortBy = 'desc';
  familyPracticeDoctors: Doctor[] = [];
  pediatricDoctors: Doctor[] = [];
  practices = BASE_CONFIG.practices;

  constructor(private doctorService: DoctorService) { }

  ngOnInit() {
    this.getDoctors();
  }

  getDoctors(): void {
    this.doctorService.getDoctors()
      .subscribe(doctors => {
        // the member variables below will hold collections of doctors that are bound to the app.component.html template
        this.familyPracticeDoctors = this.processDoctorArray(doctors, this.practices.familyPracticeDoctors.type, this.sortBy);
        this.pediatricDoctors = this.processDoctorArray(doctors, this.practices.pediatricDoctors.type, this.sortBy);
      });
  }

  /**
   * Event handler for sorting list of doctors.
   * @param {object} evt - DOM event object.
   */
  handleSort(evt) {
    // determine practice of doctors to sort - familyPracticeDoctors OR pediatricDoctors
    const practice =  evt.target.getAttribute('data-practice');
    const { value } = evt.target;

    // prevent unecessary sorting by validating value and current sortBy value against selected value
    if (value !== 'Sort by' && value !== this.sortBy) {
      this.sortBy = value;
      this[practice] = this.processDoctorArray(this[practice], this.practices[practice].type, value);
    }
  }

  /**
   * Helper method. Returns sorted args by order, default is descending order.
   * @param {object} a
   * @param {object} b
   * @param {string} order - the order to sort by. desc or asc
   */
  static sortByReviews(a, b, order = 'desc') {
    return (order === 'desc') ? b - a : a - b;
  }

  processDoctorArray(doctors, practiceType, order): Doctor[] {
     // Implement your code here
    return doctors.filter(({ specialty }) => specialty === practiceType).sort((a, b) => {
      return AppComponent.sortByReviews(a.reviewCount, b.reviewCount, order);
    });
  }
}
