import { Observable } from "rxjs";

export function createHttpObservable(url: string) {
    return Observable.create(observer => {

      // this is part of fetch API  
      const controller = new AbortController();
      const signal = controller.signal;

      // Promise
      fetch(url, { signal })
        .then(response => {
          console.log(response)


          if(response.ok) {
          // returns another Promise
            return response.json(); 
          }
          else {
            observer.error(`Request failed with status code: ${response.status}`);
          }


        })
        .then(body => {

          observer.next(body);

          // terminate observable stream
          observer.complete();

        })
        .catch(err => {

          observer.error(err);
          
        })

        // this return function is triggered by the unsubscribe method
        return () => controller.abort();
      })
}

