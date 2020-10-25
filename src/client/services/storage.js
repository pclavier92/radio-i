const LAST_LOCATION = 'last_location';

class Storage {
  constructor() {
    this.session = window.sessionStorage;
  }

  setLastLocation(location) {
    this.session.setItem(LAST_LOCATION, location);
  }

  getLastLocation() {
    const lastLocation = this.session.getItem(LAST_LOCATION);
    this.session.removeItem(LAST_LOCATION);
    return lastLocation;
  }
}

export default new Storage();
