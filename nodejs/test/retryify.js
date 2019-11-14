const retryify = require('retryify');

const withRetry = retryify({
  retries: 5,
  timeout: 500,
  factor: 2,
  // errors: [RequestError, StatusCodeError],
  log: function(msg) { console.log('retryify log', msg); },
});

const test = withRetry(async function(arg1) {
  console.log('test start');
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1500 + 500));

  if (Math.random() > 0.3) {
    console.log('test error');
    throw new Error('xxx');
  }
  console.log('test end');
  return 'test_' + arg1;
});

async function run() {
  try {
    const res = await test('xxx');
    console.log(res);
  } catch (err) {
    console.log(err);
  }
}

run();