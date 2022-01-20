# Generate fixture data for tests

To get fixture data for a given command:
1) Make sure you have a working PulseAudio v13 server. See [Testing-e2e-setup.md](Testing-e2e-setup.md)
2) Edit `test/e2e/getFixtureData.ts`, find the line where the client invokes a command and change it to your command:
```
const data = await client.<yourCommand>(<params>)
```
3) Run `ts-node test/e2e/getFixtureData.ts`. This will create several files of interest: `PAPacket.write.*` and `PACommand.data`.
4) Create the fixture file `test/fixtures/<command_type>/<command>.json` with the following keys:
- "queryParameters" --> Array. Parameters passed to the command (`<params>`). Prepend a `2` to the list, corresponding to the test `requestId`.
- "queryBuffer" --> String (hex buffer). The request sent to the PA server. Can be found in `PAPacket.write.buffer`.
- "replyBuffer" --> String (hex buffer). The response received from the PA server. Can be found in `PAPacket.read.buffer`.
- "replyObject" --> Object. The parsed response received from the PA server. Can be found in `PACommand.data`.