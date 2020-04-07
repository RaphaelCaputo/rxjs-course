import { Component, OnInit } from '@angular/core';
import { Observable, noop, of, concat, interval, merge } from 'rxjs';
import { createHttpObservable } from '../common/util';
import { map } from 'rxjs/operators';

@Component({
  selector: 'overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    const http$ = createHttpObservable(`api/courses`);

    const courses$ = http$.pipe(
      map(res => res[`payload`])
    )

    http$.subscribe(
      courses => console.log(courses),
      noop, // No operation or () => {}
      () => console.log(`completed`));

    // Subscribing to both Observables is the same as subscribing to http$ two times,
    // since the courses Observable receives the http Observable
    courses$.subscribe(
      courses => console.log(courses),
      noop, // No operation or () => {}
      () => console.log(`completed`));

    // Go to HomeComponent for examples of tap and shareReplay


    // concat and of operators
    // of
    // Emit variable amount of values in a sequence and then emits a complete notification
    // concat
    // Subscribe to observables in order as previous completes,
    // if the previous Obsevable does not complete, the next wont get subscribed
    const source$1 = of(1, 2, 3);
    const source$2 = of(4, 5, 6);
    const source$3 = of(7, 8, 9);

    const resultConcat$ = concat(source$1, source$2, source$3);

    // resultConcat$.subscribe(console.log);

    // merge operator
    // Ideal for performing long running operations in parallel
    const interval1$ = interval(1000);
    const interval2$ = interval1$.pipe(map(val => val * 10));
    
    const resultMerge$ = merge(interval1$, interval2$);

    // resultMerge$.subscribe(console.log);


    // Go to CourseDialogComponent for concatMap, mergeMap and exhaustMap

    
    // Canceling and Observable
    const sub = http$.subscribe(console.log);

    setTimeout(() => sub.unsubscribe(), 0);

    // Go to CourseComponent for switchMap, debounceTime, distinctUntilChanged filtering and forkJoin


    // Go to HomeComponent for retryWhen and delayWhen
  }
}
