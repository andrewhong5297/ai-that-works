# HumanLayer Hello World

HumanLayer is an API and SDK that helps AI builders create agents that feel more like real humans.

For the purposes of this workshop, we'll use HumanLayer to build agents that can receive messages from channels like slack/email, and respond / converse with humans on those channels.

This pre-req guide will walk you through getting a HumanLayer API key and verifying that it works.

## Step 1: Get a HumanLayer API key

Sign up at https://app.humanlayer.dev/ and grab an API key, export it in your shell.

    export HUMANLAYER_API_KEY=...

## Step 2: install humanlayer

Install the humanlayer npm package

    npm install humanlayer

## Step 3: run the test script with your email

Choose an email that you can access - we'll use this to test that agents can send you emails there, and that they can receive replies from you.

    export HUMANLAYER_EMAIL=your_email@somewhere.com

Run the test script

    npx tsx src/index.ts "hi what's shakin'"

The CLI will print something like:


```
-----Sending to Human------
check your email inbox
```

You should get an email with the text of your CLI message.

Go ahead and reply to the email with any text, e.g. "not much hbu"

After a few seconds, the CLI will print something like:

```
-----Response from Human------
not much hbu
```


Congrats! Your agents can now send and receive emails!

### HumanLayer credits

You get 100 credits for free when signing up for HumanLayer. 

During the workshop, additional credits will be provided.
