const schedule = require('node-schedule');
const { spawn } = require('child_process');

// Schedule the task to run once a week
const job = schedule.scheduleJob('0 0 * * 0', () => { // At midnight on Sundays
    try {
        const pythonProcess = spawn('python3', ['crawler.py']); 

        pythonProcess.stdout.on('data', (data) => {
            process.stdout.write(`Crawler output: ${data}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Crawler error output: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            console.log(`Crawler process exited with code: ${code}`);
        });

    } catch (error) {
        console.error('Failed to start the crawler process:', error);
    }
});

console.log("Scheduled task started. The MET FAQ crawler will run weekly.");

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down gracefully...');
    job.cancel();
    console.log('Scheduled job cancelled.');
    process.exit(0);
});

function yetAnotherFunction() {
    // Placeholder for future logic
    console.log("Another:Shuaijun Liu");
}
