const moment = require('moment');
const _ = require('lodash');

const arr = [
  { minute: 1, fees: 2000 },
  { minute: 16, fees: 5000 },
  { minute: 31, fees: 0 }
];

export function calcFine(time) {
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

function timeConvert(n) {
  var num = n;
  var hours = num / 60;
  var rhours = Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);

  return { rhours, rminutes };
}

export function calcLeaveFormTime(time) {
  const startOfWorkDay = moment('08:30', 'HH:mm');
  const currentTime = moment(time, 'HH:mm');

  const diffInMinutes = moment
    .duration(currentTime.diff(startOfWorkDay))
    .asMinutes();

  return timeConvert(diffInMinutes);
}

export function getResultMessage(time) {
  let message;

  const fine = calcFine(time);

  if (fine === 0) {
    message = `Bạn không cần phải đóng tiền phạt.`;
  } else if (fine > 0) {
    message = `Số tiền phạt bạn cần đóng là ${Intl.NumberFormat('en-US').format(
      fine
    )} VNĐ.`;
  } else {
    const { rhours, rminutes } = calcLeaveFormTime(time);

    const timeArr = [];

    if (rhours) timeArr.push(`${rhours} giờ`);
    timeArr.push(`${rminutes} phút`);

    message = `Bạn vui lòng viết leave form cho ${timeArr.join(' ')}.`;
  }

  return {
    success: fine === 0,
    message
  };
}
