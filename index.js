const spawn = require('child_process').spawn;
exports.handler = async (event, context) => {
    return new Promise((resolve, reject)=>{
        let result = '';
        const proc = spawn('./php', ['./todo.php']);
        // Output
        proc.stdout.on('data', (data) => {
            result += data;
            console.log(`child stdout:\n${data}`);
        });

        proc.stderr.on('data', (data) => {
            console.error(`child stderr:\n${data}`);
            reject(data);
        });

        proc.on('exit', function (code, signal) {
            console.log(`child process exited with code ${code} and signal ${signal}`);
            result = JSON.parse(result);
            resolve(result);
        });
    })
}