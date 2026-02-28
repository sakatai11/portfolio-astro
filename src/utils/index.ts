/**
 * 画像の幅と高さから、アスペクト比が 2:3（縦長）かどうかを判定します。
 * @param width 画像の幅
 * @param height 画像の高さ
 * @returns 2:3 の場合は true、それ以外は false
 */
export const isPortrait32 = (width: number, height: number): boolean => {
  if (!width || !height) return false;

  // 3:2 の比率は 1.5。2:3（縦長）はその逆数なので 2/3 ≈ 0.666...
  // 小数点以下の計算誤差を考慮して判定します
  const ratio = width / height;
  return Math.abs(ratio - 2 / 3) < 0.01;
};
