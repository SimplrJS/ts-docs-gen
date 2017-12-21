# index.ts

## MyFunction()

```typescript
function MyFunction<T extends { myProperty: string; myPropertyTwo?: number | undefined; } = { myProperty: string; }>(): T
```

### Type parameters

| Name | Constraint type                                                | Default type              |
| ---- | -------------------------------------------------------------- | ------------------------- |
| T    | \{ myProperty: string; myPropertyTwo?: number \| undefined; \} | \{ myProperty: string; \} |

### Return type

T


