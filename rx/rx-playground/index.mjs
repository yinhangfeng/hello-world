import { Observable, interval, from, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

let logObserverCount = 0;

export function createLogObserver(name = `LogObserver: ${logObserverCount++}`) {
  return {
    next: (value) => {
      console.log(name, 'next', value);
    },
    error: (error) => {
      console.log(name, 'error', error);
    },
    complete: () => {
      console.log(name, 'complete');
    },
  };
}

function test1() {
  const observable = interval(1000).pipe(take(4));
  observable.subscribe(createLogObserver('interval sub1'));
  observable.subscribe(createLogObserver('interval sub2'));

  const observable1 = from([1, 2, 3]);
  observable1.subscribe(createLogObserver('from sub1'));
  observable1.subscribe(createLogObserver('from sub2'));
}

function test2() {
  const observable = new Observable(function (subscriber) {
    console.log('Observable subscribe subscriber:', subscriber, 'this', this);
    const id = setInterval(() => {
      subscriber.next('hi');
    }, 1000);

    return () => {
      console.log('Observable teardown');
      clearInterval(id);
    };
  });

  const subscription = observable.subscribe(createLogObserver());
  const subscription1 = observable.subscribe(createLogObserver());

  setTimeout(() => {
    subscription.unsubscribe();
  }, 3000);
}

function test3() {
  const subject = new Subject();
  console.log(subject.value);
  subject.next(0);
  console.log(subject.value);

  subject.subscribe(createLogObserver());
  subject.subscribe(createLogObserver());

  subject.next(1);
  setTimeout(() => {
    subject.next(2);
  });
}

test3();
