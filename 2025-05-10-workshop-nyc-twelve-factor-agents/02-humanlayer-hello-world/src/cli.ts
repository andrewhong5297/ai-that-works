// cli.ts lets you invoke the agent loop from the command line

import { humanlayer } from "humanlayer";

export async function cli() {
    // Get command line arguments, skipping the first two (node and script name)
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.error("Error: Please provide a message as a command line argument");
        process.exit(1);
    }

    // Join all arguments into a single message
    const cliMessage = args.join(" ");
    const HUMANLAYER_EMAIL = process.env.HUMANLAYER_EMAIL;
    const HUMANLAYER_API_KEY = process.env.HUMANLAYER_API_KEY;

    if (!HUMANLAYER_EMAIL) {
        console.error("Error: HUMANLAYER_EMAIL is not set");
        process.exit(1);
    }

    if (!HUMANLAYER_API_KEY) {
        console.error("Error: HUMANLAYER_API_KEY is not set");
        process.exit(1);
    }

    const hl = humanlayer({
        runId: '12fa-cli-agent',
        contactChannel: {
            email: {
                address: HUMANLAYER_EMAIL,
            }
        }
    })

    console.log("-----Sending to Human------")
    console.log(`check your email inbox for ${HUMANLAYER_EMAIL}`)
    const response = await hl.fetchHumanResponse({
        spec: {
            msg: cliMessage,
        }
    })

    console.log("-----Response from Human------")
    console.log(response)
}
