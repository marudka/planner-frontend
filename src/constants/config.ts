const BASE_URL = `http://${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_PORT ? ':' + process.env.REACT_APP_PORT : ''}`;

export {
  BASE_URL
}