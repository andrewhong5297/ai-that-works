import express from 'express';
import { Thread, agentLoop } from '../src/agent';
import { ThreadStore } from '../src/state';

const app = express();
app.use(express.json());

const store = new ThreadStore();

// POST /thread - Start new thread
app.post('/thread', async (req, res) => {
    const thread = new Thread([{
        type: "user_input",
        data: req.body.message
    }]);
    
    const threadId = store.create(thread);
    const result = await agentLoop(thread);
    
    // If clarification is needed, include the response URL
    const lastEvent = result.events[result.events.length - 1];
    if (lastEvent.data.intent === 'request_more_information') {
        lastEvent.data.response_url = `/thread/${threadId}/response`;
    }
    
    store.update(threadId, result);
    res.json({ 
        thread_id: threadId,
        ...result 
    });
});

// GET /thread/:id - Get thread status
app.get('/thread/:id', (req, res) => {
    const thread = store.get(req.params.id);
    if (!thread) {
        return res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread);
});


type ApprovalPayload = {
    type: "approval";
    approved: boolean;
    comment?: string;
}

type ResponsePayload = {
    type: "response";
    response: string;
}

type Payload = ApprovalPayload | ResponsePayload;

// POST /thread/:id/response - Handle clarification response
app.post('/thread/:id/response', async (req, res) => {
    const thread = store.get(req.params.id);
    if (!thread) {
        return res.status(404).json({ error: "Thread not found" });
    }

    const body: Payload = req.body;

    let lastEvent = thread.events[thread.events.length - 1];

    if (lastEvent.data.intent === 'divide' && body.type === 'approval') {
        if (body.approved) {
            thread.events.push({
                type: "tool_response",
                data: lastEvent.data.a / lastEvent.data.b
            });
        } else {
            thread.events.push({
                type: "tool_response",
                data: `user denied the operation with feedback: "${body.comment}"`
            });
        }
    } else if (lastEvent.data.intent === 'request_more_information' && body.type === 'response') {
        thread.events.push({
            type: "human_response",
            data: req.body.message
        });
    // } else if (lastEvent.data.intent === 'done_for_now') {
    //     thread.events.push({
    //         type: "human_response",
    //         data: lastEvent.data.message
    //     });
    // }
    
    
    // loop until stop event
    const result = await agentLoop(thread);

    lastEvent = result.events[result.events.length - 1];
    lastEvent.data.response_url = `/thread/${req.params.id}/response`;
    
    store.update(req.params.id, result);
    res.json(result);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export { app };