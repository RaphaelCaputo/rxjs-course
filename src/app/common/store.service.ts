import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { Course } from '../model/course';
import { createHttpObservable } from './util';
import { tap, map, filter } from 'rxjs/operators';

@Injectable()
export class StoreService {

  private subject = new BehaviorSubject<Course[]>([])

  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor() { }

  init() {

    const http$ = createHttpObservable('/api/courses');

    http$.pipe(
      tap(() => console.log('HTTP request executed')),
      map(res => Object.values(res['payload']))
    )
    .subscribe(courses => this.subject.next(courses));

  }

  selectBeginnerCourses() {
    return this.filterByCategory('BEGINNER');
  }

  selectAdvancedCourses() {
    return this.filterByCategory('ADVANCED');
  }

  selectCourseById(courseId: number) {
    return this.courses$.pipe(
      map(courses => courses.find(course => course.id == courseId)),
      filter(course => !!course)
    );
  }

  filterByCategory(category: string) {
    return this.courses$.pipe(
      map(courses => courses.filter(course => course.category == category))
    );
  }

  saveCourse(courseId: number, changes): Observable<any> {
    
    const courses = this.subject.getValue();

    const courseIndex = courses.findIndex(course => course.id === courseId);

    // A cheap way to duplicate an array.
    const newCourses = courses.slice(0);

    // With spreading, you can change a property non-destructively:
    // You make a copy of the object where the property has a different value.
    newCourses[courseIndex] = {
      ...courses[courseIndex],
      ...changes
    }

    this.subject.next(newCourses);

    return from(fetch(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'content-type': 'application/json'
      }
    }));
  } 

  
}
