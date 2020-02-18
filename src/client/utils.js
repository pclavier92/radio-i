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

export { getHashParams };
