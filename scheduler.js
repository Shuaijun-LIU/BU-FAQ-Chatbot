// 
const schedule = require('node-schedule');
const { spawn } = require('child_process');

// Schedule the task to run once a week
const job = schedule.scheduleJob('0 0 * * 0', () => { // At midnight on Sundays
    const pythonProcess = spawn('python3', ['crawler.py']); // Use 'python' if on Windows

    pythonProcess.stdout.on('data', (data) => {
        console.log(`Crawler output: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Crawler error output: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Crawler process exited with code: ${code}`);
    });
});

console.log("Scheduled task started. The MET FAQ crawler will run weekly.");


function yetAnotherFunction() {
    // |--202407-MacOS--|
    // |--Another:Shuaijun Liu--|
    console.log("Another:Shuaijun Liu");
}