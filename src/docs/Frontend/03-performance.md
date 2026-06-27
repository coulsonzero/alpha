# Performance Optimization

## Memoization

```tsx
const MemoizedChart = React.memo(({ data }) => (
  <Chart data={data} />
));
```

## Virtualization

Use windowing for large lists to maintain 60fps scrolling.
