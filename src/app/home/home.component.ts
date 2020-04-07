import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, Observable, of, timer} from 'rxjs';
import {catchError, delayWhen, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import { createHttpObservable } from '../common/util';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    beginnerCourses$: Observable<Course[]>;

    advancedCourses$: Observable<Course[]>;

    constructor() {

    }

    // tap operator
    // Produce sideffects, used to update something outside the Observable chain
    // shareReplay
    // used to give access to the last emitted value on subscription

    ngOnInit() {
        const http$: Observable<Course[]> = createHttpObservable(`/api/courses`);


        // If an error occurs, it will retry after 2 seconds,
        // creating a new stream and subscribing to this new stream until the stream does not erros out
        const courses$ = http$.pipe(
            tap(() => console.log(`HTTP request executed`)), 
            map(res => res[`payload`]),
            shareReplay(),
            retryWhen(erros => erros.pipe(
                delayWhen(() => timer(2000))
            ))
        );

        this.beginnerCourses$ = courses$.pipe(
            map(courses => courses.filter(course => course.category === `BEGINNER`))
        );

        this.advancedCourses$ = courses$.pipe(
            map(courses => courses.filter(course => course.category === `ADVANCED`))
        );


    }

}
