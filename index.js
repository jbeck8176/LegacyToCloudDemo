const spawn = require('child_process').spawn;
exports.handler = async (event, context) => {
    const proc = spawn('php', ['todo.php']);
    proc.stdout.pipe(process.stdout)
    return;
}