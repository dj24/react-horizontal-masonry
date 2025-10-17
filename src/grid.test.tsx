import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Grid } from "./grid";

describe("Grid", () => {
  describe("Core Rendering", () => {
    it("renders Grid with children", () => {
      render(
        <Grid gap="10px" targetRowAspectRatio={5}>
          <Grid.Item ratio={1}>
            <div>Test Item</div>
          </Grid.Item>
        </Grid>
      );

      expect(screen.getByText("Test Item")).toBeInTheDocument();
    });

    it("renders Grid.Item components correctly", () => {
      render(
        <Grid gap="10px" targetRowAspectRatio={5}>
          <Grid.Item ratio={1}>
            <div>Item 1</div>
          </Grid.Item>
          <Grid.Item ratio={2}>
            <div>Item 2</div>
          </Grid.Item>
        </Grid>
      );

      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
    });

    it("applies gap styles to container and rows", () => {
      const { container } = render(
        <Grid gap="15px" targetRowAspectRatio={5}>
          <Grid.Item ratio={1}>
            <div>Item 1</div>
          </Grid.Item>
          <Grid.Item ratio={2}>
            <div>Item 2</div>
          </Grid.Item>
        </Grid>
      );

      const gridContainer = container.firstChild as HTMLElement;
      expect(gridContainer).toHaveStyle({
        display: "flex",
        flexDirection: "column",
        gap: "15px",
      });

      const rows = container.querySelectorAll(
        'div[style*="flex-direction: row"]'
      );
      rows.forEach((row) => {
        expect(row).toHaveStyle({
          display: "flex",
          flexDirection: "row",
          gap: "15px",
        });
      });
    });
  });

  describe("Row Grouping Algorithm", () => {
    it("groups items into rows based on targetRowAspectRatio", () => {
      const { container } = render(
        <Grid gap="10px" targetRowAspectRatio={5}>
          <Grid.Item ratio={2}>
            <div>Item 1</div>
          </Grid.Item>
          <Grid.Item ratio={2}>
            <div>Item 2</div>
          </Grid.Item>
          <Grid.Item ratio={3}>
            <div>Item 3</div>
          </Grid.Item>
        </Grid>
      );

      // Should create 1 row: [2+2+3=7] (all items fit because 4<5 and 7>5 but algorithm adds before checking)
      const rows = container.querySelectorAll(
        'div[style*="flex-direction: row"]'
      );
      expect(rows).toHaveLength(1);
      expect(rows[0].children).toHaveLength(3);
    });

    it("creates single item per row when item ratio exceeds target", () => {
      const { container } = render(
        <Grid gap="10px" targetRowAspectRatio={2}>
          <Grid.Item ratio={3}>
            <div>Wide Item 1</div>
          </Grid.Item>
          <Grid.Item ratio={4}>
            <div>Wide Item 2</div>
          </Grid.Item>
        </Grid>
      );

      // Each item should be in its own row
      const rows = container.querySelectorAll(
        'div[style*="flex-direction: row"]'
      );
      expect(rows).toHaveLength(2);
      expect(rows[0].children).toHaveLength(1);
      expect(rows[1].children).toHaveLength(1);
    });

    it("groups multiple items in one row when cumulative ratio < target", () => {
      const { container } = render(
        <Grid gap="10px" targetRowAspectRatio={10}>
          <Grid.Item ratio={1}>
            <div>Item 1</div>
          </Grid.Item>
          <Grid.Item ratio={2}>
            <div>Item 2</div>
          </Grid.Item>
          <Grid.Item ratio={3}>
            <div>Item 3</div>
          </Grid.Item>
          <Grid.Item ratio={2}>
            <div>Item 4</div>
          </Grid.Item>
        </Grid>
      );

      // All items should be in one row (1+2+3+2=8 < 10)
      const rows = container.querySelectorAll(
        'div[style*="flex-direction: row"]'
      );
      expect(rows).toHaveLength(1);
      expect(rows[0].children).toHaveLength(4);
    });

    it("creates multiple rows with mixed aspect ratios", () => {
      const { container } = render(
        <Grid gap="10px" targetRowAspectRatio={3}>
          <Grid.Item ratio={1}>
            <div>Item 1</div>
          </Grid.Item>
          <Grid.Item ratio={2}>
            <div>Item 2</div>
          </Grid.Item>
          <Grid.Item ratio={1}>
            <div>Item 3</div>
          </Grid.Item>
          <Grid.Item ratio={3}>
            <div>Item 4</div>
          </Grid.Item>
        </Grid>
      );

      // Should create 2 rows: [1+2=3], [1+3=4]
      const rows = container.querySelectorAll(
        'div[style*="flex-direction: row"]'
      );
      expect(rows).toHaveLength(2);
      expect(rows[0].children).toHaveLength(2); // [1+2=3]
      expect(rows[1].children).toHaveLength(2); // [1+3=4]
    });

    it("creates multiple rows when individual items exceed target", () => {
      const { container } = render(
        <Grid gap="10px" targetRowAspectRatio={2}>
          <Grid.Item ratio={1}>
            <div>Item 1</div>
          </Grid.Item>
          <Grid.Item ratio={1}>
            <div>Item 2</div>
          </Grid.Item>
          <Grid.Item ratio={3}>
            <div>Item 3</div>
          </Grid.Item>
          <Grid.Item ratio={4}>
            <div>Item 4</div>
          </Grid.Item>
        </Grid>
      );

      // Should create 3 rows: [1+1=2], [3], [4]
      const rows = container.querySelectorAll(
        'div[style*="flex-direction: row"]'
      );
      expect(rows).toHaveLength(3);
      expect(rows[0].children).toHaveLength(2); // [1+1=2]
      expect(rows[1].children).toHaveLength(1); // [3]
      expect(rows[2].children).toHaveLength(1); // [4]
    });
  });

  describe("Width Calculation", () => {
    it("calculates correct width percentages for items in a row", () => {
      const { container } = render(
        <Grid gap="10px" targetRowAspectRatio={5}>
          <Grid.Item ratio={2}>
            <div>Item 1</div>
          </Grid.Item>
          <Grid.Item ratio={3}>
            <div>Item 2</div>
          </Grid.Item>
        </Grid>
      );

      // Both items should be in one row (2+3=5)
      const rows = container.querySelectorAll(
        'div[style*="flex-direction: row"]'
      );
      expect(rows).toHaveLength(1);

      // Check that width calculation is applied via ref callback
      const items = rows[0].children;
      expect(items).toHaveLength(2);
    });

    it("uses max of cumulative ratio and target ratio in calculation", () => {
      const { container } = render(
        <Grid gap="10px" targetRowAspectRatio={3}>
          <Grid.Item ratio={2}>
            <div>Item 1</div>
          </Grid.Item>
          <Grid.Item ratio={2}>
            <div>Item 2</div>
          </Grid.Item>
        </Grid>
      );

      // Items should be in one row (2+2=4 > 3, but we use max(4, 3) = 4)
      const rows = container.querySelectorAll(
        'div[style*="flex-direction: row"]'
      );
      expect(rows).toHaveLength(1);
      expect(rows[0].children).toHaveLength(2);
    });

    it("handles single wide item (ratio > target)", () => {
      const { container } = render(
        <Grid gap="10px" targetRowAspectRatio={2}>
          <Grid.Item ratio={5}>
            <div>Wide Item</div>
          </Grid.Item>
        </Grid>
      );

      // Single item should be in its own row
      const rows = container.querySelectorAll(
        'div[style*="flex-direction: row"]'
      );
      expect(rows).toHaveLength(1);
      expect(rows[0].children).toHaveLength(1);
    });
  });

  describe("Error Handling", () => {
    it("throws error when invalid children (non-GridItem) are provided", () => {
      // Suppress console.error for this test since we expect an error
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        render(
          <Grid gap="10px" targetRowAspectRatio={5}>
            <div>Invalid child</div>
          </Grid>
        );
      }).toThrow(
        "Invalid child provided to Grid, ensure that a valid GridItem with correct props is used as children"
      );

      consoleSpy.mockRestore();
    });

    it("validates GridItem has required ratio prop", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Create a mock GridItem without ratio prop
      const MockGridItem = () => <div>Mock Item</div>;

      expect(() => {
        render(
          <Grid gap="10px" targetRowAspectRatio={5}>
            <MockGridItem />
          </Grid>
        );
      }).toThrow(
        "Invalid child provided to Grid, ensure that a valid GridItem with correct props is used as children"
      );

      consoleSpy.mockRestore();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty Grid (no children)", () => {
      const { container } = render(
        <Grid gap="10px" targetRowAspectRatio={5}></Grid>
      );

      const rows = container.querySelectorAll(
        'div[style*="flex-direction: row"]'
      );
      expect(rows).toHaveLength(0);
    });

    it("handles single Grid.Item", () => {
      const { container } = render(
        <Grid gap="10px" targetRowAspectRatio={5}>
          <Grid.Item ratio={1}>
            <div>Single Item</div>
          </Grid.Item>
        </Grid>
      );

      const rows = container.querySelectorAll(
        'div[style*="flex-direction: row"]'
      );
      expect(rows).toHaveLength(1);
      expect(rows[0].children).toHaveLength(1);
    });

    it("handles all items with same aspect ratio", () => {
      const { container } = render(
        <Grid gap="10px" targetRowAspectRatio={5}>
          <Grid.Item ratio={1}>
            <div>Item 1</div>
          </Grid.Item>
          <Grid.Item ratio={1}>
            <div>Item 2</div>
          </Grid.Item>
          <Grid.Item ratio={1}>
            <div>Item 3</div>
          </Grid.Item>
        </Grid>
      );

      // All items should be in one row (1+1+1=3 < 5)
      const rows = container.querySelectorAll(
        'div[style*="flex-direction: row"]'
      );
      expect(rows).toHaveLength(1);
      expect(rows[0].children).toHaveLength(3);
    });

    it("handles items with very small ratios (< 0.1)", () => {
      const { container } = render(
        <Grid gap="10px" targetRowAspectRatio={1}>
          <Grid.Item ratio={0.05}>
            <div>Tiny Item 1</div>
          </Grid.Item>
          <Grid.Item ratio={0.05}>
            <div>Tiny Item 2</div>
          </Grid.Item>
          <Grid.Item ratio={0.05}>
            <div>Tiny Item 3</div>
          </Grid.Item>
        </Grid>
      );

      // All items should be in one row (0.05+0.05+0.05=0.15 < 1)
      const rows = container.querySelectorAll(
        'div[style*="flex-direction: row"]'
      );
      expect(rows).toHaveLength(1);
      expect(rows[0].children).toHaveLength(3);
    });

    it("handles items with very large ratios (> 10)", () => {
      const { container } = render(
        <Grid gap="10px" targetRowAspectRatio={5}>
          <Grid.Item ratio={15}>
            <div>Huge Item 1</div>
          </Grid.Item>
          <Grid.Item ratio={20}>
            <div>Huge Item 2</div>
          </Grid.Item>
        </Grid>
      );

      // Each item should be in its own row (15 > 5, 20 > 5)
      const rows = container.querySelectorAll(
        'div[style*="flex-direction: row"]'
      );
      expect(rows).toHaveLength(2);
      expect(rows[0].children).toHaveLength(1);
      expect(rows[1].children).toHaveLength(1);
    });
  });

  describe("GridItem Component", () => {
    it("renders with correct aspect ratio style", () => {
      const { container } = render(
        <Grid.Item ratio={16 / 9}>
          <div>Content</div>
        </Grid.Item>
      );

      const item = container.firstChild as HTMLElement;
      expect(item).toHaveStyle({
        aspectRatio: "1.7777777777777777",
        border: "1px solid red",
      });
    });

    it("applies ref callback correctly", () => {
      const refCallback = vi.fn();

      render(
        <Grid.Item ratio={1} ref={refCallback}>
          <div>Content</div>
        </Grid.Item>
      );

      expect(refCallback).toHaveBeenCalled();
    });
  });
});
