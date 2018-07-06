//** CAR PARK
export const arrListTableVar = (ap) => {
  return [];
};
export const arrListTableFixed = (ap) => {
  return [
    {
      label: 'Landkreis',
      key: 'landkreis'
    },
    ap.vehicles_count,
    ap.tyre_potential,
    ap.pullthrough_potential,
    ap.pirelli_volumes,
    ap.direct_volumes,
    ap.indirect_volumes,
    ap.gap,
    ap.market_share,
    ap.pos,
    ap.cd_pos
  ];
};
