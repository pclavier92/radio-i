/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
const getHashParams = () => window.location.hash
    .substring(1)
    .split('&')
    .reduce((initial, item) => {
      if (item) {
        const parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
      }
      return initial;
    }, {});

const msToMinutesSeconds = (ms) => {
  if (ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const min = Math.floor(totalSeconds / 60);
    let sec = Math.floor(totalSeconds % 60);
    if (sec < 10) {
      sec = `0${sec}`;
    }
    return `${min}:${sec}`;
  }
  return '0:00';
};

const debounce = (func, wait, immediate) => {
  let timeout;
  return function executedFunction() {
    const context = this;
    const args = arguments;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export { getHashParams, msToMinutesSeconds, debounce };
