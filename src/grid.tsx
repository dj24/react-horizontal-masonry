import React from "react";

type GridItemProps = {
  ratio: number;
  children: React.ReactNode;
  ref?: React.RefCallback<HTMLDivElement>;
};

type Row = {
  cumulativeAspectRatio: number;
  items: React.ReactElement<GridItemProps>[];
};

function GridItem({ ratio, children, ref }: GridItemProps) {
  return (
    <div ref={ref} style={{ aspectRatio: ratio }}>
      {children}
    </div>
  );
}

function isGridItem(
  child: React.ReactNode
): child is React.ReactElement<GridItemProps> {
  return (
    React.isValidElement(child) &&
    child.type === GridItem &&
    "props" in child &&
    child.props !== null &&
    typeof child.props === "object" &&
    "ratio" in child.props &&
    typeof child.props.ratio === "number"
  );
}

function _Grid({
  gap,
  targetRowAspectRatio,
  children,
  maxColumns = Infinity,
}: {
  targetRowAspectRatio: number;
  gap: string;
  children?: React.ReactNode;
  maxColumns?: number;
}) {
  const rows = React.Children.toArray(children).reduce<Row[]>((acc, child) => {
    if (!isGridItem(child)) {
      throw new Error(
        "Invalid child provided to Grid, ensure that a valid GridItem with correct props is used as children"
      );
    }
    const lastRow = acc[acc.length - 1];
    if (
      lastRow &&
      lastRow.cumulativeAspectRatio < targetRowAspectRatio &&
      acc.length < maxColumns
    ) {
      acc[acc.length - 1] = {
        items: [...lastRow.items, child],
        cumulativeAspectRatio:
          lastRow.cumulativeAspectRatio + child.props.ratio,
      };
    } else {
      return [
        ...acc,
        { cumulativeAspectRatio: child.props.ratio, items: [child] },
      ];
    }
    return acc;
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap,
        width: "100%",
      }}
    >
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: "flex",
            flexDirection: "row",
            gap,
          }}
        >
          {row.items.map((item, itemIndex) =>
            React.cloneElement(item, {
              key: `${rowIndex}-${itemIndex}`,
              ref: (node: HTMLDivElement) => {
                if (node) {
                  node.style.width = `calc(${
                    item.props.ratio * 100
                  }% / ${Math.max(
                    row.cumulativeAspectRatio,
                    targetRowAspectRatio
                  )})`;
                }
              },
            })
          )}
        </div>
      ))}
    </div>
  );
}

const Grid = Object.assign(_Grid, { Item: GridItem });

export { Grid };
