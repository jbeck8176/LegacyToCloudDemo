const Client = require('ssh2').Client;

exports.handler = async (event, context) => {
    return new Promise((resolve, reject) => {
        let returnValue = {};
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
                    resolve(JSON.parse(returnValue));
                })
                    .on('data', (data) => {
                        // probably going to want to do more than console log the legacy applications response
                        returnValue = data.toString();
                        console.log(data.toString());
                    })
                    // handle any errors written to the stderr
                    .stderr.on('data', function (data) {
                        console.error('ERROR: ', data);
                    });
            });
        })
        .connect({
            host: 'ec2-54-210-131-238.compute-1.amazonaws.com',
            port: 22,
            username: 'ec2-user',
            privateKey: require('fs').readFileSync('awsKey/ec2demoLambda.pem')
        });
    });
}