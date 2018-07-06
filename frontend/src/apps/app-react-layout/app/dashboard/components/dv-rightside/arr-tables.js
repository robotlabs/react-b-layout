export const arrLevGermanyTotal = (ap) => {
  return (
  [
    ap.prestige_car_parc_total,
    ap.tyre_potential_total,
    ap.pirelli_sellin_total,
    ap.market_share_total
  ]
  );
};
export const arrLevGermanySeasonValues = (ap) => {
  return (
  [
    ap.tyre_potential,
    ap.pullthrough_potential,
    ap.pirelli_sellin,
    ap.gap,
    ap.market_share
  ]
  );
};
export const arrLevLandValues = (ap) => {
  return (
  [
    ap.prestige_car_parc,
    ap.tyre_potential,
    ap.pullthrough_potential,
    ap.pirelli_volumes,
    ap.gap,
    ap.direct_volumes,
    ap.indirect_volumes,
    ap.market_share
  ]
  );
};
export const arrLevLandkreisValues = (ap) => {
  return (
  [
    ap.prestige_car_parc,
    ap.tyre_potential,
    ap.pullthrough_potential,
    ap.pirelli_volumes,
    ap.gap,
    ap.market_share,
    ap.cd_pos,
    ap.cd_pos_prestige,
    ap.tt_pos
  ]
  );
};
