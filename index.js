const Client = require('ssh2').Client;

exports.handler = async (event, context) => {
    const conn = new Client();

    // handle ready signal from SSH connection
    conn.on('ready', function () {
        console.log('SSH session open!');

        // After ready signal execute the command to run the php application
        conn.exec('php todoPhpLegacy/todo.php', (err, stream) => {
            // handle errors
            if (err) {
                console.error('ERROR: ', err);
            }
            // watch for stream close
            stream.on('close', (code, signal) => {
                console.log('SSH session closed! ');
                conn.end();
            })
                .on('data', (data) => {
                    // probably going to want to do more than console log the legacy applications response
                    console.log(data.toString());
                })
                // handle any errors written to the stderr
                .stderr.on('data', function (data) {
                    console.error('ERROR: ', data);
                });
        });
    })
    .connect({
        host: 'ec2-54-91-241-131.compute-1.amazonaws.com',
        port: 22,
        username: 'ec2-user',
        privateKey: require('fs').readFileSync('awsKey/ec2demo.pem')
    });
    return;
}