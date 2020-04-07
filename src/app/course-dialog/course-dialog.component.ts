import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import {fromEvent, from} from 'rxjs';
import {concatMap, distinctUntilChanged, exhaustMap, filter, mergeMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit, AfterViewInit {

    form: FormGroup;
    course:Course;

    @ViewChild('saveButton', { static: true }) saveButton: ElementRef;

    @ViewChild('searchInput', { static: true }) searchInput : ElementRef;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course:Course ) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription,Validators.required]
        });

    }

    // filter
    // Emit values that pass the provided condition

    // fromPromise, as of RxJs 6 is wrapped in the from() method
    // Turn an array, promise, or iterable into an observable

    // fromEvent
    // Creates an Observable that emits events of a specific type coming from the given event target.
    // Turn event into observable sequence.

    // concatMap
    // Takes one value and converts into another Observable,
    // as long as this Observable is emiting value, those will be emited in the output of concatMap.
    // Only when the initial Observable is completed, we are going to create a second Observable
    // that emits its values in the output and then completes
    // Below example:
    // Take the form values, turn then in http requests
    // and wait for the first http request to complete before creating the second http request

    // concatMap aproache:
    // every event change will fire a request, if i type 123456789,
    // it will fire 9 requests to the backend, waiting for every request to be completed to fire another request

    // mergeMap aproache:
    // every event change will fire a request, not waiting for a request to be completed before launching another.
    // is  ideal for sending http requests in parallel.

    ngOnInit() {
        this.form.valueChanges.pipe(
            filter(() => this.form.valid),
            concatMap(changes => this.saveCourses(changes))
        )
        .subscribe()
    }


    saveCourses(changes) {
        return from(fetch(`/api/courses/${this.course.id}`, {
            method: `PUT`,
            body: JSON.stringify(changes),
            headers: {
                'content-type': 'application/json'
            }
        }));
    }


    ngAfterViewInit() {

    // exhaustMap aproache:
    // ignores extra values while the current Observable is still ongoing.
    // After the first click, all sequencial clicks will be ignored until the request is completed.
    // It will only receive another request after the first is completed.

        fromEvent(this.saveButton.nativeElement, `click`).pipe(
            exhaustMap(() => this.saveCourses(this.form.value))
        ).subscribe();

    }



    close() {
        this.dialogRef.close();
    }

}
