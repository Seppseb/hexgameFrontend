import React, { useState, useEffect } from "react";
import HexTile from "./HexTile";
import HexNode from "./HexNode";
import HexPath from "./HexPath";
import HexPort from "./HexPort";
import BuildMenu from "./BuildMenu";

export default function HexBoard({ board, onBuild, onBuildRoad, onMoveRobber, isPlacingInitialVillage, isPlacingInitialRoad, isPlayerTurn, isMovingRobber, isBuildPhase, player }) {
  const rowConfig = [3, 4, 5, 4, 3];

  // --- STATE ---
  // General selection state. 'type' can be "node" or "road"
  // { type: "node"|"road", r: 0, c: 0, top: "...", left: "..." }
  const [selectedObj, setSelectedObj] = useState(null);

  const TUNING = {
    offsetY: -26.5, // Move entire grid Up/Down
    offsetX: 0.2,  // Move entire grid Left/Right
    stepY: 2.45,   // Vertical distance between node rows
    width: 5.67,    // Horizontal distance between nodes (should match Hex width)
    zigzagX: 0,     // Fine-tune alternating rows (tips vs valleys)
    zigzagY: 0.5,
    
    // --- PATH SPECIFIC TUNING ---
    // Paths sit vertically between node rows, so we shift them down half a step
    evenPathOffsetX: -0.15, //
    oddPathOffsetX: -0.1, //
    pathOffsetY: 1.6, // Approx half of stepY
    evenPathWidth: 4,    // Horizontal distance between paths (should match Hex width)
    oddPathWidth: 2.85,    // Horizontal distance between paths (should match Hex width)
    pathScale: 1.0,    // Multiplier if paths need to spread out more/less
  };

  // --- HANDLERS ---

  const handleNodeClick = (r, c, top, left) => {
    setSelectedObj({ type: "node", r, c, top, left });
  };

  const handlePathClick = (r, c, top, left) => {
    setSelectedObj({ type: "road", r, c, top, left });
  };

  const handleTileClick = (r, c) => {
    onMoveRobber(r, c);
  };

  const confirmBuild = () => {
    if (!selectedObj) return;

    if (selectedObj.type === "node") {
      onBuild && onBuild(selectedObj.r, selectedObj.c);
    } else if (selectedObj.type === "road") {
      onBuildRoad && onBuildRoad(selectedObj.r, selectedObj.c);
    }

    setSelectedObj(null);
  };

  useEffect(() => {
    if (!isBuildPhase) cancelBuild();
  }, [isBuildPhase]);

  const cancelBuild = () => {
    setSelectedObj(null);
  };

  return (
    <div className="relative inline-block p-8 mt-10 bg-slate-100 rounded-xl">
      
      {/* LAYER 1: HEX TILES */}
      <div className="relative z-20 flex flex-col items-center">
        {rowConfig.map((cols, rowIndex) => (
          <div
            key={rowIndex}
            className="flex justify-center"
            style={{
              marginTop: rowIndex === 0 ? 0 : "-12px", 
              marginLeft: `${(5 - cols) * 1}px`, 
            }}
          >
            {Array.from({ length: cols }).map((_, colIndex) => (
              <HexTile
                key={`${rowIndex}-${colIndex}`}
                type={board?.tiles?.[rowIndex]?.[colIndex]?.type || "water"}
                number={board?.tiles?.[rowIndex]?.[colIndex]?.number || "0"}
                hasRobber={board?.tiles?.[rowIndex]?.[colIndex]?.hasRobber || false}
                isPlacingRobber={isPlayerTurn && isMovingRobber}
                onClick={() => handleTileClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* OVERLAYS CONTAINER */}
      <div className="absolute inset-0 pointer-events-none">

        {/* LAYER 0: Ports - Z-INDEX 0 (Below Tiles) */}
        <div className="absolute z-0">
            {board && board.paths && board.paths.map((rowPaths, rIndex) => {
                const isEvenRow = rIndex % 2 === 0; // Diagonals
                const isFirstHalf = rIndex <= 4;
                
                // Calculate Y Center for this row of paths
                // It sits halfway between Node Row 'r' and 'r+1'
                const topPosRaw = (rIndex * TUNING.stepY) + TUNING.offsetY + TUNING.pathOffsetY;
                const topPos = `${topPosRaw}rem`;

                return rowPaths.map((pathData, cIndex) => {
                    let leftPosRaw = 0;
                    let angle = 0;

                    if (isEvenRow) {
                        // --- DIAGONAL ROADS (\ / \ /) ---
                        // These are twice as dense horizontally as nodes
                        // We use (Width / 2) as the step
                        const pathsInRow = rowPaths.length;
                        const rowWidthOffset = (11 - pathsInRow) * (TUNING.width / 4); // Heuristic centering
                        
                        // Alternate Angles: Even index = \ (-60), Odd index = / (60)
                        angle = cIndex  % 2 === 0 ? -60 : 60;
                        if (isFirstHalf) angle = -angle;
                        
                        // Custom centering logic for diagonals to match the zig-zag nodes
                        // You might need to tweak the '0.5' multiplier here
                        leftPosRaw = (cIndex * (TUNING.width / 2)) + rowWidthOffset + TUNING.offsetX + TUNING.evenPathOffsetX; 
                    } else {
                        // --- VERTICAL ROADS ( | | | ) ---
                        // These align directly with the columns
                        const pathsInRow = rowPaths.length;
                        // Centering logic similar to nodes
                        const rowWidthOffset = (6 - pathsInRow) * (TUNING.oddPathWidth) + TUNING.oddPathOffsetX;
                        
                        angle = 0;
                        leftPosRaw = (cIndex * TUNING.width) + rowWidthOffset + TUNING.offsetX;
                    }

                    const leftPos = `${leftPosRaw}rem`;

                    return (
                        <HexPort 
                            key={`p-${rIndex}-${cIndex}`}
                            port={pathData.port}
                            angle={angle}
                            top={topPos}
                            left={leftPos}
                        />
                    );
                });
            })}
        </div>
        
        {/* LAYER 2: PATHS (ROADS) - Z-INDEX 10 (Below Nodes) */}
        <div className="absolute z-20">
            {board && board.paths && board.paths.map((rowPaths, rIndex) => {
                const isEvenRow = rIndex % 2 === 0; // Diagonals
                const isFirstHalf = rIndex <= 4;
                
                // Calculate Y Center for this row of paths
                // It sits halfway between Node Row 'r' and 'r+1'
                const topPosRaw = (rIndex * TUNING.stepY) + TUNING.offsetY + TUNING.pathOffsetY;
                const topPos = `${topPosRaw}rem`;

                return rowPaths.map((pathData, cIndex) => {
                    let leftPosRaw = 0;
                    let angle = 0;

                    if (isEvenRow) {
                        // --- DIAGONAL ROADS (\ / \ /) ---
                        // These are twice as dense horizontally as nodes
                        // We use (Width / 2) as the step
                        const pathsInRow = rowPaths.length;
                        const rowWidthOffset = (11 - pathsInRow) * (TUNING.width / 4); // Heuristic centering
                        
                        // Alternate Angles: Even index = \ (-60), Odd index = / (60)
                        angle = cIndex  % 2 === 0 ? -60 : 60;
                        if (isFirstHalf) angle = -angle;
                        
                        // Custom centering logic for diagonals to match the zig-zag nodes
                        // You might need to tweak the '0.5' multiplier here
                        leftPosRaw = (cIndex * (TUNING.width / 2)) + rowWidthOffset + TUNING.offsetX + TUNING.evenPathOffsetX; 
                    } else {
                        // --- VERTICAL ROADS ( | | | ) ---
                        // These align directly with the columns
                        const pathsInRow = rowPaths.length;
                        // Centering logic similar to nodes
                        const rowWidthOffset = (6 - pathsInRow) * (TUNING.oddPathWidth) + TUNING.oddPathOffsetX;
                        
                        angle = 0;
                        leftPosRaw = (cIndex * TUNING.width) + rowWidthOffset + TUNING.offsetX;
                    }

                    const leftPos = `${leftPosRaw}rem`;

                    return (
                        <HexPath 
                            key={`p-${rIndex}-${cIndex}`}
                            isPlacingInitialRoad={isPlacingInitialRoad}
                            isBuildPhase={isBuildPhase}
                            canPlaceRoad={pathData.canPlaceRoad && player && player.userId && !!pathData.canPlaceRoad.includes(player.userId)}
                            canPlaceInitialRoad={pathData.canPlaceInitialRoad && player && player.userId && !!pathData.canPlaceInitialRoad.includes(player.userId)}
                            color={pathData.color} // e.g. "beige" or "red"
                            angle={angle}
                            top={topPos}
                            left={leftPos}
                            onClick={() => handlePathClick(rIndex, cIndex, topPos, leftPos)}
                        />
                    );
                });
            })}
        </div>

        {/* LAYER 3: NODES - Z-INDEX 50 (Top) */}
        <div className="absolute z-30">
            {board && board.nodes && board.nodes.map((rowNodes, rIndex) => {
            const topPos = `${(rIndex * TUNING.stepY + (rIndex % 2 === 0 ? TUNING.zigzagY : -TUNING.zigzagY)) + TUNING.offsetY}rem`;
            const isZigZagRow = rIndex % 2 !== 0;
            const zigzagCorrection = isZigZagRow ? TUNING.zigzagX : 0;

            return rowNodes.map((node, cIndex) => {
                const nodesInRow = rowNodes.length;
                const rowWidthOffset = (6 - nodesInRow) * (TUNING.width / 2);
                const leftPos = `${(cIndex * TUNING.width) + rowWidthOffset + TUNING.offsetX + zigzagCorrection}rem`;

                return (
                <React.Fragment key={`n-${rIndex}-${cIndex}`}>
                    <HexNode
                        playerColor={player?.color}
                        color={node.color} 
                        isPlacingInitialVillage={isPlacingInitialVillage}
                        isBuildPhase={isBuildPhase}
                        canPlaceVillage={node.canPlaceVillage && player && player.userId && !!node.canPlaceVillage.includes(player.userId)}
                        buildFactor={node.buildFactor}
                        top={topPos}
                        left={leftPos}
                        onClick={() => handleNodeClick(rIndex, cIndex, topPos, leftPos)}
                    />
                </React.Fragment>
                );
            });
            })}
        </div>

        {/* LAYER 4: MENU */}
        {selectedObj && (
          <div className="absolute z-40 pointer-events-auto">
            <BuildMenu 
              onConfirm={confirmBuild}
              onCancel={cancelBuild}
              style={{
                top: selectedObj.top,
                left: selectedObj.left,
                transform: "translate(-50%, -100%) translateY(-1rem)" 
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}