const logger = {
  error: (err, req = null) => {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      path: req ? req.path : null,
      method: req ? req.method : null,
      timestamp: new Date().toISOString()
    });
  },
  info: (message) => {
    console.log('Info:', {
      message,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = logger; 