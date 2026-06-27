# Real-Time Pipelines

## Overview

Real-time pipelines allow you to process data as it arrives.

```typescript
const pipeline = new Pipeline({
  source: "kafka",
  transform: (e) => ({ ...e, ts: Date.now() }),
});
```
