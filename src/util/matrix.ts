type Rotation3D = [number, number, number];

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

function multiplyMatrix3x3(a: number[][], b: number[][]): number[][] {
  const result = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      for (let k = 0; k < 3; k++) {
        result[row]![col]! += a[row]![k]! * b[k]![col]!;
      }
    }
  }

  return result;
}

function eulerToMatrix(x: number, y: number, z: number): number[][] {
  const cx = Math.cos(x);
  const sx = Math.sin(x);

  const cy = Math.cos(y);
  const sy = Math.sin(y);

  const cz = Math.cos(z);
  const sz = Math.sin(z);

  const Rx = [
    [1, 0, 0],
    [0, cx, -sx],
    [0, sx, cx],
  ];

  const Ry = [
    [cy, 0, sy],
    [0, 1, 0],
    [-sy, 0, cy],
  ];

  const Rz = [
    [cz, -sz, 0],
    [sz, cz, 0],
    [0, 0, 1],
  ];

  // IMPORTANT:
  //
  // R = Rx × Ry × Rz
  //
  // This is the rotation convention that produces:
  //
  // [10, 10, 10] + [10, 10, 10]
  // -> [18.5441, 21.4734, 18.5441]

  return multiplyMatrix3x3(multiplyMatrix3x3(Rx, Ry), Rz);
}

function combineOrientationAndRotation(
  orientation: Rotation3D,
  rotation: Rotation3D,
): Rotation3D {
  const [ox, oy, oz] = orientation;
  const [rx, ry, rz] = rotation;

  const orientationMatrix = eulerToMatrix(
    ox * DEG_TO_RAD,
    oy * DEG_TO_RAD,
    oz * DEG_TO_RAD,
  );

  const rotationMatrix = eulerToMatrix(
    rx * DEG_TO_RAD,
    ry * DEG_TO_RAD,
    rz * DEG_TO_RAD,
  );

  /*
   * Combine the rotations.
   */
  const combined = multiplyMatrix3x3(orientationMatrix, rotationMatrix);

  /*
   * Extract Euler angles from:
   *
   * R = Rx × Ry × Rz
   *
   * Matrix form:
   *
   * [ cy*cz,              -cy*sz,             sy     ]
   * [ sx*sy*cz + cx*sz,   -sx*sy*sz + cx*cz, -sx*cy ]
   * [ -cx*sy*cz + sx*sz, cx*sy*sz + sx*cz,   cx*cy ]
   */

  const y = Math.asin(Math.max(-1, Math.min(1, combined[0]![2]!)));

  const x = Math.atan2(-combined[1]![2]!, combined[2]![2]!);

  const z = Math.atan2(-combined[0]![1]!, combined[0]![0]!);

  return [x * RAD_TO_DEG, y * RAD_TO_DEG, z * RAD_TO_DEG];
}

export { combineOrientationAndRotation };
