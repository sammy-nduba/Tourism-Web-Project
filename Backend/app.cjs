// cPanel / Phusion Passenger Entry Point Wrapper
// Since this project uses ES Modules ("type": "module"), Passenger's internal require()
// fails if we point it directly to dist/index.js.
// This wrapper uses a dynamic import() to load the ES module, which works correctly.
import('./dist/index.js').catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
