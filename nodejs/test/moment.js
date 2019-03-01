const moment = require('moment');

const m1 = moment('11:00', 'HH:mm');

console.log(m1.toString(), m1.format(), m1.valueOf());

m1.startOf('day');

console.log(m1.toString());

console.log(`moment().add(1, 'days') > moment()`, moment().add(1, 'days') > moment(), moment().add(1, 'days') + 1);

function testDiff() {
  const m1 = moment();
  const m2 = moment(1550105835000);

  console.log(m1.diff(m2));

  console.log(moment.utc(m1.diff(m2)).format('YYYY-MM-DD HH:mm:ss'));

  const d = moment.duration(m2.diff(m1));
  console.log(d, d.seconds(), d.asSeconds());
}

testDiff();