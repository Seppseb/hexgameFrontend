import React, { useState, useEffect } from "react";
import HexTile from "./HexTile";
import HexNode from "./HexNode";
import HexPath from "./HexPath";
import BuildMenu from "./BuildMenu";

export default function HexBoard({ board, onBuild, onBuildRoad, onMoveRobber, isPlacingInitialVillage, isPlacingInitialRoad, isPlayerTurn, isMovingRobber, isBuildPhase, player }) {
  // --- STATE ---
  // General selection state. 'type' can be "node" or "road"
  // { type: "node"|"road", r: 0, c: 0, top: "...", left: "..." }
  const [selectedObj, setSelectedObj] = useState(null);

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

  const tileWidth = 91.4;
  const rowWidth = 39.7;
  const yTopNodes = board?.tiles == null ? 0 : -99 - (board.tiles.length - 1) * 79; // base top pos
  const xMid = board?.tiles == null ? 0 : -2.5 + (board.tiles.length / 2) * 91.6; // base position middle of board
  const yTopPaths = yTopNodes + 12;

  return (
    <div className="relative inline-block p-8 mt-10 bg-slate-100 rounded-xl">
      
      {/* LAYER 1: HEX TILES */}
      <div className="relative z-20 flex flex-col items-center">
        {board?.tiles?.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex justify-center"
            style={{
              marginTop: rowIndex === 0 ? 0 : "-12px", 
              marginLeft: `${(5 - row?.length || 0) * 1}px`, 
            }}
          >
            {Array.from({ length: row?.length || 0 }).map((_, colIndex) => (
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
        {/* LAYER 2: PATHS (ROADS) - Z-INDEX 10 (Below Nodes) */}
        <div className="absolute z-20">
            {board && board.paths && board.paths.map((rowPaths, rIndex) => {

                const yRowOffset = rIndex * rowWidth // row index time distance between rows
                const yPos = yTopPaths + yRowOffset;

                const isEvenRow = rIndex % 2 === 0; // Diagonals
                const isFirstHalf = rIndex < (board.paths.length - 1) / 2;
                
                const rowLength = rowPaths.length;
                const rowMidIndex = (rowLength - 1) / 2;
                return rowPaths.map((pathData, cIndex) => {
                    let angle = 0;

                    const xPosBase = xMid - 0.5; // small change since graphic isnt perfectly centered
                    const indexDistanceToMid = cIndex - rowMidIndex;
                    const xOffSet = indexDistanceToMid * tileWidth;
                    const xPos = xPosBase + xOffSet * (isEvenRow ? 1/2 : 1);

                    if (isEvenRow) {
                        // --- DIAGONAL ROADS (\ / \ /) ---
                        // Alternate Angles: Even index = \ (-60), Odd index = / (60)
                        angle = cIndex  % 2 === 0 ? -60 : 60;
                        if (isFirstHalf) angle = -angle;
                    } else {
                        // --- VERTICAL ROADS ( | | | ) ---
                        angle = 0;
                      }

                    return (
                        <HexPath 
                            key={`p-${rIndex}-${cIndex}`}
                            rIndex={rIndex}
                            cIndex={cIndex}
                            port={pathData.port}
                            isPlacingInitialRoad={isPlacingInitialRoad}
                            isBuildPhase={isBuildPhase}
                            canPlaceRoad={pathData.canPlaceRoad && player && player.canBuyRoad && player.userId && !!pathData.canPlaceRoad.includes(player.userId)}
                            canPlaceInitialRoad={pathData.canPlaceInitialRoad && player && player.userId && !!pathData.canPlaceInitialRoad.includes(player.userId)}
                            color={pathData.color} // e.g. "beige" or "red"
                            angle={angle}
                            top={yPos}
                            left={xPos}
                            onClick={() => handlePathClick(rIndex, cIndex, yPos, xPos)}
                        />
                    );
                });
            })}
        </div>

        {/* LAYER 3: NODES - Z-INDEX 50 (Top) */}
        <div className="absolute z-30">
            {board && board.nodes && board.tiles && board.nodes.map((rowNodes, rIndex) => {
                const yRowOffset = rIndex * rowWidth // row index time distance between rows
                const yOddRowOffset = (rIndex % 2 == 0) ? 0 : -16; // offset for uneven rows
                const yPos = yTopNodes + yRowOffset + yOddRowOffset;

                const rowLength = rowNodes.length;
                const rowMidIndex = (rowLength - 1) / 2;
                return rowNodes.map((node, cIndex) => {
                    const indexDistanceToMid = cIndex - rowMidIndex;
                    const xOffSet = indexDistanceToMid * tileWidth;
                    const xPos = xMid + xOffSet;
                    return (
                    <React.Fragment key={`n-${rIndex}-${cIndex}`}>
                        <HexNode
                            playerColor={player?.color}
                            color={node.color} 
                            isPlacingInitialVillage={isPlacingInitialVillage}
                            isBuildPhase={isBuildPhase}
                            canPlaceVillage={node.canPlaceVillage && player && player.canBuyVillage && player.userId && !!node.canPlaceVillage.includes(player.userId)}
                            canPlaceCity={player && player.canBuyCity}
                            buildFactor={node.buildFactor}
                            top={yPos}
                            left={xPos}
                            onClick={() => handleNodeClick(rIndex, cIndex, yPos, xPos)}
                        />
                    </React.Fragment>
                    );
                });
              })
            }
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