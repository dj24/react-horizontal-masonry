import { useState } from "react";
import { Grid } from "./grid";

const possibleRatios = [9 / 16, 21 / 9, 1, 16 / 9, 4 / 3, 2 / 3];

function App() {
  const [ratios, setRatios] = useState(() =>
    Array.from(
      { length: 10 },
      () => possibleRatios[Math.floor(Math.random() * possibleRatios.length)]
    )
  );

  const addRandomRatio = () => {
    setRatios([
      ...ratios,
      possibleRatios[Math.floor(Math.random() * possibleRatios.length)],
    ]);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        alignItems: "start",
      }}
    >
      <button onClick={addRandomRatio}>Add Random Ratio</button>
      <Grid gap="10px" targetRowAspectRatio={8}>
        {ratios.map((ratio) => (
          <Grid.Item ratio={ratio}>
            <img
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "flex",
                objectPosition: "center",
                borderRadius: "10px",
              }}
              src={`https://picsum.photos/600/600?random=${ratio}`}
            />
          </Grid.Item>
        ))}
      </Grid>
    </div>
  );
}

export default App;
