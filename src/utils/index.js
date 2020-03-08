const moment = require('moment');
const _ = require('lodash');

const arr = [
  { minute: 1, fees: 2000 },
  { minute: 16, fees: 5000 },
  { minute: 31, fees: 0 }
];

function calcFine(time) {
  const startOfWorkDay = moment('09:00', 'HH:mm');
  const currentTime = moment(time, 'HH:mm');

  const diffInMinutes = moment
    .duration(currentTime.diff(startOfWorkDay))
    .asMinutes();

  if (diffInMinutes >= arr[arr.length - 1].minute) {
    return -1;
  }

  let pos = 0;
  let totalFees = 0;

  while (pos < arr.length - 1 && diffInMinutes >= arr[pos].minute) {
    const { minute, fees } = arr[pos];
    const { minute: nextMinute } = arr[pos + 1];

    totalFees +=
      ((diffInMinutes >= nextMinute ? nextMinute - 1 : diffInMinutes) -
        (minute - 1)) *
      fees;
    pos++;
  }

  return totalFees;
}

const fees = calcFine('09:30');
