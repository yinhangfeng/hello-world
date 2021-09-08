const FakeTimers = require('@sinonjs/fake-timers');

async function run() {
  const start = Date.now();
  const clock = FakeTimers.createClock(start, 10);

  function timeout(time) {
    clock.setTimeout(() => {
      console.log('timeout:', time, 'clock.Date.now():', clock.Date.now());
    }, time);
  }
  function interval(time) {
    clock.setInterval(() => {
      console.log('interval:', time, 'clock.Date.now():', clock.Date.now());
    }, time);
  }
  function tick(time) {
    console.log('tick:', time, 'clock.Date.now():', clock.Date.now());
    clock.tick(time);
    console.log('tick after:', time, 'clock.Date.now():', clock.Date.now());
  }
  async function tickAsync(time) {
    console.log('tickAsync:', time);
    setTimeout(() => {
      console.log('tickAsync setTimeout:', time);
    });
    const res = await clock.tickAsync(time);
    console.log('tickAsync after:', time, res);
  }

  console.log('start Date.now():', start, 'clock.Date.now():', clock.Date.now());
  timeout();
  tick();
  timeout();
  tick();

  timeout();
  timeout(1);
  timeout(10);
  timeout(100);
  timeout(1000);
  timeout(10000);

  interval(100);
  // interval();
  tick(0.1);
  tick(0.4);
  tick(0.5);
  tick(0.6);
  tick(0.4);
  tick(1);
  tick(100);

  await tickAsync(1000);
  await tickAsync(10000);

  console.log('countTimers:', clock.countTimers());

  // clock.runAll();

  console.log('end Date.now():', start, 'clock.Date.now():', clock.Date.now());
}

run();
