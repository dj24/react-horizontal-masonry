# React Horizontal Masonry

A flexible horizontal masonry layout component for React that arranges items in rows based on their aspect ratios.

## Features

- 📦 **Tiny Size**: Under 1kb minified + gzipped
- ⚛️ **Stateless**: No extra state, purely prop-driven rendering
- 🔧 **Zero Dependencies**: No external dependencies beyond React
- ⚡ **TypeScript**: Full TypeScript support with type definitions
- 🎨 **Customizable**: Configurable gap, target row aspect ratio, and styling

## Installation

```bash
npm install react-horizontal-masonry
# or
yarn add react-horizontal-masonry
# or
bun add react-horizontal-masonry
```

## Usage

```tsx
import { Grid } from "react-horizontal-masonry";

function App() {
  return (
    <Grid gap="10px" targetRowAspectRatio={5}>
      <Grid.Item ratio={9 / 16}>
        <div>Portrait image</div>
      </Grid.Item>
      <Grid.Item ratio={21 / 9}>
        <div>Wide banner</div>
      </Grid.Item>
      <Grid.Item ratio={1}>
        <div>Square image</div>
      </Grid.Item>
      <Grid.Item ratio={16 / 9}>
        <div>Landscape image</div>
      </Grid.Item>
    </Grid>
  );
}
```

## API

### Grid Props

| Prop                   | Type        | Required | Default    | Description                                        |
| ---------------------- | ----------- | -------- | ---------- | -------------------------------------------------- |
| `gap`                  | `string`    | Yes      | -          | CSS gap value between items (e.g., "10px", "1rem") |
| `targetRowAspectRatio` | `number`    | Yes      | -          | Target aspect ratio for each row (width/height)    |
| `maxColumns`           | `number`    | No       | `Infinity` | Maximum number of columns per row                  |
| `children`             | `ReactNode` | Yes      | -          | Grid.Item components                               |

### Grid.Item Props

| Prop       | Type        | Required | Default | Description                             |
| ---------- | ----------- | -------- | ------- | --------------------------------------- |
| `ratio`    | `number`    | Yes      | -       | Aspect ratio of the item (width/height) |
| `children` | `ReactNode` | Yes      | -       | Content to display inside the item      |

## How It Works

The component automatically groups items into rows based on their aspect ratios. Items are added to the current row until adding another item would exceed the target row aspect ratio, at which point a new row is started.

The width of each item is calculated proportionally based on its aspect ratio relative to the total aspect ratio of the row.

## License

MIT
