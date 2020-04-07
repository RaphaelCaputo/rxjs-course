import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, forkJoin} from 'rxjs';
import {Lesson} from '../model/lesson';
import { createHttpObservable } from '../common/util';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    courseId: string;

    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;


    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {

        this.courseId = this.route.snapshot.params['id'];

        const course$ = createHttpObservable(`/api/courses/${this.courseId}`);

        const lessons$ = this.loadLessons();

        // forkJoin
        // send multiple requests at the same time and emits the value when all Observables are completed,
        // sending the last value before completion
        forkJoin(course$, lessons$).pipe(
            tap(([course, lessons]) => {

                console.log(`course`, course);
                console.log(`lessons`, lessons);

            })
        ).subscribe();

    }

    ngAfterViewInit() {

        // switchMap
        // If the Observable is not completed and another Observable emits a new value,
        // it will unsubscribe to the old Observable and switch to the new Observalbe.
        // If it gets new searchTerm while an http request was still ongoing,
        // it will unsubscribe to the searchTerm and the http request will be canceled,
        // then it will emit the new searchTerm http request and wait for it to be completed 

        this.lessons$ = fromEvent<any>(this.input.nativeElement, `keyup`).pipe(
            map(event => event.target.value),
            startWith(''),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(search => this.loadLessons(search))
        )

    }

    loadLessons(search = ''): Observable<Lesson[]> {
        return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`).pipe(
            map(res => res[`payload`])
        )
    }




}
